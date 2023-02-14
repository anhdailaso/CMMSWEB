using System.Globalization;

namespace VietSoft.CMMS.Web.Helpers
{
    public static class ExtensionCommon
    {
        //public static string ToColor(this int statusCode)
        //{
        //    //if (statusCode == (int)RequestStatus.APPROVED)
        //    //    return "status-approved";
        //    //else if (statusCode == (int)RequestStatus.NOT_APPROVED)
        //    //    return "status-not-approved";
        //    //else if(statusCode == (int)RequestStatus.NOT_YET_APPROVED)
        //    //    return "status-not-approved-yet";
        //    //else return string.Empty;
        //}

        public static string ToCurrencyText(this double value, string culturecode = "vi-VN")
        {

            var cultureInfo = CultureInfo.GetCultureInfo(culturecode);
            try
            {
                return value.ToString("#,##0.##", cultureInfo.NumberFormat);

            }
            catch (Exception)
            {
                return "";
            }
        }

        public static string ToCurrencyText(this double? value, string culturecode = "vi-VN")
        {

            var cultureInfo = CultureInfo.GetCultureInfo(culturecode);
            try
            {
                return value.Value.ToString("#,##0.##", cultureInfo.NumberFormat);

            }
            catch (Exception)
            {
                return "0";
            }
        }

        public static string Capitalize(this string word)
        {
            return word.Substring(0, 1).ToUpper() + word.Substring(1).ToLower();
        }

        public static string ToTextHoursAndMinus(this double hours)
        {
            var result = "";
            if (hours <= 0)
            {
                return result;
            }

            var hoursInt = Math.Floor(hours);
            var minus = Math.Ceiling((hours - hoursInt) * 60);

            if (hoursInt > 0)
            {
                result = $"{hoursInt} giờ";
            }
            if (minus > 0)
            {
                result += (result.Length > 0 ? " " : "") + $"{minus} phút";
            }

            return result;
        }

        public static string ToBase64StringImage(this string path)
        {
            string result = string.Empty;
            if (string.IsNullOrEmpty(path)) return result;
            
            var extension = Path.GetExtension(path);
            var base64 = Convert.ToBase64String(System.IO.File.ReadAllBytes(path));
            result = string.Format($"{"data:image/{0};base64"}{base64}", extension);

            return result;
        }
    }
}
