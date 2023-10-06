using FluentFTP;
using Microsoft.ApplicationBlocks.Data;
using System;
using System.Collections;
using System.Data;
using System.Net;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Resources;

namespace VietSoft.CMMS.Web
{
    public static class Commons
    {
        public static bool CheckTimeOverlap(List<Tuple<DateTime, DateTime>> timeList)
        {
            // Sắp xếp danh sách theo thời gian bắt đầu của mỗi khoảng thời gian
            timeList.Sort((x, y) => x.Item1.CompareTo(y.Item1));

            // Kiểm tra xem có khoảng thời gian nào bắt đầu trước khi khoảng thời gian trước đó kết thúc không
            for (int i = 0; i < timeList.Count - 1; i++)
            {
                if (timeList[i + 1].Item1 < timeList[i].Item2)
                {
                    return true;
                }
            }
            return false;
        }

        public static async Task SendThongBao(int iHD, string tableName, string sSoPhieu, string scot1, string connect, string Username = "")
        {
            try
            {

                DataSet set = SqlHelper.ExecuteDataset(connect, "spGetThongBao", iHD, Username, tableName, sSoPhieu, scot1);
                //gửi cho đữ liệu table 1
                DataTable table1 = set.Tables[0];
                string sMes = table1.Rows[0][0].ToString();
                string sDt = table1.Rows[0][1].ToString();
                if (sDt != "")
                {
                    string[] array = sDt.Split(';');
                    foreach (var item in array)
                    {
                        SendTL(sMes, item, connect);
                    }
                }
                DataTable table2 = set.Tables[1];
                foreach (DataRow item in table2.Rows)
                {
                    //kiểm tra sđt không nằm trong 
                    if (!sDt.Contains(item[0].ToString()))
                    {
                        SendTL(sMes, item[0].ToString(), connect);
                    }
                }
            }
            catch
            {
            }
        }

        public static async void SendTL(string message, string sdt, string connect)
        {
            try
            {
                string apiLocal = "";
                string appID = "";
                string apiHash = "";
                string phonenumber = "";
                try
                {
                    //đăng nhập
                    DataTable dt = new DataTable();
                    dt.Load(SqlHelper.ExecuteReader(connect, CommandType.Text, "SELECT AppID, SecretKey API_HASH, PHONE_NUMBER_LOGIN, API FROM dbo.ACCESS_TOKEN WHERE ID_TOKEN = 1"));

                    apiLocal = dt.Rows[0]["API"].ToString();
                    appID = dt.Rows[0]["AppID"].ToString();
                    apiHash = dt.Rows[0]["API_HASH"].ToString();
                    phonenumber = dt.Rows[0]["PHONE_NUMBER_LOGIN"].ToString();
                    login(apiLocal, appID, apiHash, phonenumber);
                }
                catch
                {

                }
                sdt = "84" + sdt.Substring(1, 9);
                string apiLogin = apiLocal + "mTeleSend";
                string jsonContent = "";
                string queryString = "";
                using (HttpClient client = new HttpClient())
                {
                    queryString = $"mRecipient={sdt}&msg={message}";
                    HttpResponseMessage response = await client.GetAsync($"{apiLogin}?{queryString}");
                    jsonContent = await response.Content.ReadAsStringAsync();
                }
            }
            catch (Exception)
            {
            }
        }

        private static async Task<int> login(string apiLocal, string appID, string apiHash, string phonenumber)
        {
            try
            {
                string apiLogin = apiLocal + "mTeleLogin";

                using (HttpClient client = new HttpClient())
                {
                    string queryString = $"mAppId={appID}&mApiHash={apiHash}&mPhone={phonenumber}";
                    HttpResponseMessage response = await client.GetAsync($"{apiLogin}?{queryString}");
                    string responseBody = await response.Content.ReadAsStringAsync();
                    if (response.IsSuccessStatusCode)
                    {

                        string sCode = "";

                        if (responseBody.Contains("verification_code"))
                        {
                            apiLogin = apiLocal + "mTeleCode";
                            queryString = $"mCode={sCode}";
                            response = await client.GetAsync($"{apiLogin}?{queryString}");
                            responseBody = await response.Content.ReadAsStringAsync();
                        }

                        if (responseBody.Contains("password"))
                        {
                            apiLogin = apiLocal + "mTeleCode";
                            queryString = $"mCode={sCode}";
                            response = await client.GetAsync($"{apiLogin}?{queryString}");
                            responseBody = await response.Content.ReadAsStringAsync();
                        }
                    }
                }
                return 1;
            }
            catch (Exception ex)
            {

                return 0;
            }
        }
        public static string LayDuoiFile(string strFile)
        {
            string[] FILE_NAMEArr, arr;
            string FILE_NAME = "";
            string str = "";
            FILE_NAMEArr = strFile.Split(@"\");
            FILE_NAME = FILE_NAMEArr[FILE_NAMEArr.Length - 1];
            arr = FILE_NAME.Split(".");
            return "." + arr[arr.Length - 1];
        }

        public static async Task<List<string>> SaveUploadMultiFile(IList<IFormFile> files, string msmay)
        {
            var uploadedFiles = new List<string>();
            int stt = 1;
            try
            {
                foreach (var dataSource in files)
                {
                    string fullFilePath = SessionManager.ThongTinChung.DUONG_DAN_TL + "\\" + "Hinh_May" + "\\" + msmay + "\\" + DateTime.Now.Day + "_" + DateTime.Now.Month + "_" + DateTime.Now.Year + "\\" + "YCNSD" + "_" + msmay + "_" + DateTime.Now.Day.ToString() + DateTime.Now.Month.ToString() + DateTime.Now.Year.ToString() + "_" + stt.ToString() + LayDuoiFile(dataSource.FileName);
                    stt++;
                    var fileName = "\\" + "YCNSD" + "_" + msmay + "_" + DateTime.Now.Day.ToString() + DateTime.Now.Month.ToString() + DateTime.Now.Year.ToString() + "_" + stt.ToString() + LayDuoiFile(dataSource.FileName);
                    string rootPath = SessionManager.ThongTinChung.DUONG_DAN_TL + "\\" + "Hinh_May" + "\\" + msmay + "\\" + DateTime.Now.Day + "_" + DateTime.Now.Month + "_" + DateTime.Now.Year;

                    bool exists = System.IO.Directory.Exists(rootPath);
                    if (!exists)
                        System.IO.Directory.CreateDirectory(rootPath);
                    var extension = Path.GetExtension(rootPath + fileName);
                    if (System.IO.File.Exists(fullFilePath)) continue;
                    using (var stream = System.IO.File.Create(fullFilePath))
                    {
                        await dataSource.CopyToAsync(stream);
                        uploadedFiles.Add(fullFilePath);
                    }
                }
            }
            catch
            {
            }
            return uploadedFiles;
        }

        public static async Task<string> SaveUploadFile(IFormFile dataSource, string remoteDirectory)
        {
            try
            {
                string rootpath = Path.Combine(SessionManager.ThongTinChung.DUONG_DAN_TL, remoteDirectory);
                if (Directory.Exists(rootpath))
                {
                    Directory.Delete(rootpath,true);
                }
                Directory.CreateDirectory(rootpath);
                var fullFilePath = Path.Combine(rootpath, DateTime.Now.ToString("yyyyMMdd_HHmmssff") + LayDuoiFile(dataSource.FileName));
                if (!System.IO.File.Exists(fullFilePath))
                {
                    using (var stream = System.IO.File.Create(fullFilePath))
                    {
                        await dataSource.CopyToAsync(stream);
                    }
                }    
                return fullFilePath.Replace(SessionManager.ThongTinChung.DUONG_DAN_TL,"");
            }
            catch
            {
                return "";
            }
        }

        public static async Task<string> DownloadFileAsBase64(string localFilePath)
        {
            string result = "";
            string pathfile = Path.Combine(SessionManager.ThongTinChung.DUONG_DAN_TL, localFilePath);
            try
            {
                byte[] fileBytes = File.ReadAllBytes(pathfile);
                result = Convert.ToBase64String(fileBytes);
            }
            catch
            {
                result = "";
            }
            return result;
        }

        public static async Task<byte[]> DownloadFileAsBytes(string localFilePath)
        {
            byte[] resulst = null;
            string pathfile = Path.Combine(SessionManager.ThongTinChung.DUONG_DAN_TL, localFilePath);
            try
            {
                resulst = File.ReadAllBytes(pathfile);
            }
            catch
            {
                resulst = null;
            }
            return resulst;
        }

        //public List<string> UploadMultipleFiles(IList<IFormFile> files, string remoteDirectory)
        //{
        //    var resulst = new List<string>();
        //    try
        //    {
        //        if (ftpServer != "")
        //        {
        //            using (var ftpClient = new FtpClient(ftpServer, credentials, port))
        //            {
        //                ftpClient.Connect();
        //                if (ftpClient.DirectoryExists(remoteDirectory))
        //                {
        //                    ftpClient.DeleteDirectory(remoteDirectory, FtpListOption.AllFiles);
        //                }
        //                ftpClient.CreateDirectory(remoteDirectory);
        //                foreach (var file in files)
        //                {
        //                    using (var stream = file.OpenReadStream())
        //                    {
        //                        // Tạo một tệp trung gian từ Stream
        //                        var tempFilePath = Path.GetTempFileName();
        //                        using (var tempFileStream = File.Create(tempFilePath))
        //                        {
        //                            stream.CopyTo(tempFileStream);
        //                        }
        //                        //Tải lên tệp trung gian
        //                        var remoteFilePath = Path.Combine(remoteDirectory, DateTime.Now.ToString("yyyyMMdd_HHmmssff") + LayDuoiFile(file.FileName));
        //                        ftpClient.UploadFile(tempFilePath, remoteFilePath);
        //                        resulst.Add(remoteFilePath);
        //                        // Xóa tệp trung gian
        //                        File.Delete(tempFilePath);
        //                    }
        //                }
        //                ftpClient.Disconnect();
        //            }
        //        }
        //        return resulst;
        //    }

        //    catch (Exception ex)
        //    {
        //        return null;
        //    }
        //}


    }
}
