using System.Security.Cryptography;
using System.Text;

namespace VietSoft.CMMS.Web.Extensions
{
    public static class Encrypts
    {
        private const string _secrectKey = "VietSoft.CMMS.Web";
        public static string Base64UrlEncode(this string value) => value.Replace("=", string.Empty).Replace('+', '-').Replace('/', '_');

        public static string EncryptString(this string text, string keyString = _secrectKey)
        {
            try
            {
                var key = Encoding.UTF8.GetBytes(keyString);

                using (var aesAlg = Aes.Create())
                {
                    using (var encryptor = aesAlg.CreateEncryptor(key, aesAlg.IV))
                    {
                        using (var msEncrypt = new MemoryStream())
                        {
                            using (var csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                            using (var swEncrypt = new StreamWriter(csEncrypt))
                            {
                                swEncrypt.Write(text);
                            }

                            var iv = aesAlg.IV;

                            var decryptedContent = msEncrypt.ToArray();

                            var result = new byte[iv.Length + decryptedContent.Length];

                            Buffer.BlockCopy(iv, 0, result, 0, iv.Length);
                            Buffer.BlockCopy(decryptedContent, 0, result, iv.Length, decryptedContent.Length);

                            return Convert.ToBase64String(result).Base64UrlEncode();
                        }
                    }
                }
            }
            catch(Exception ex)
            {
                throw ex;
            }
            
        }

        public static string? DecryptString(this string cipherText, string keyString = _secrectKey)
        {
            if (string.IsNullOrEmpty(cipherText))
            {
                return null;
            }

            var fullCipher = Convert.FromBase64String(cipherText.Base64UrlDecode());

            var iv = new byte[16];
            var cipher = new byte[16];

            Buffer.BlockCopy(fullCipher, 0, iv, 0, iv.Length);
            Buffer.BlockCopy(fullCipher, iv.Length, cipher, 0, iv.Length);
            var key = Encoding.UTF8.GetBytes(keyString);

            using (var aesAlg = Aes.Create())
            {
                using (var decryptor = aesAlg.CreateDecryptor(key, iv))
                {
                    string result;
                    using (var msDecrypt = new MemoryStream(cipher))
                    {
                        using (var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                        {
                            using (var srDecrypt = new StreamReader(csDecrypt))
                            {
                                result = srDecrypt.ReadToEnd();
                            }
                        }
                    }

                    return result;
                }
            }
        }

        public static string Base64UrlDecode(this string value)
        {
            string str = value;
            if (!string.IsNullOrEmpty(str))
            {
                str = str.Replace('-', '+').Replace('_', '/');
                switch ((str.Length % 4))
                {
                    case 0:
                        break;

                    case 2:
                        str = str + "==";
                        break;

                    case 3:
                        str = str + "=";
                        break;

                    default:
                        throw new Exception("Illegal base64 url string!");
                }
            }
            return str;

        }
    }
}
