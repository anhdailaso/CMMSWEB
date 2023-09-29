using Microsoft.ApplicationBlocks.Data;
using System;
using System.Collections;
using System.Data;
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
                        SendTL(sMes, item,connect);
                    }
                }
                DataTable table2 = set.Tables[1];
                foreach (DataRow item in table2.Rows)
                {
                    //kiểm tra sđt không nằm trong 
                    if (!sDt.Contains(item[0].ToString()))
                    {
                        SendTL(sMes, item[0].ToString(),connect);
                    }
                }
            }
            catch
            {
            }
        }

        public static async void SendTL(string message, string sdt,string connect)
        {
            try
            {
                string apiLocal = "";
                string appID = "";
                string apiHash = "";
                string phonenumber ="";
                try
                {
                    //đăng nhập
                    DataTable dt = new DataTable();
                    dt.Load(SqlHelper.ExecuteReader(connect, CommandType.Text, "SELECT AppID, SecretKey API_HASH, PHONE_NUMBER_LOGIN, API FROM dbo.ACCESS_TOKEN WHERE ID_TOKEN = 1"));

                    apiLocal = dt.Rows[0]["API"].ToString();
                    appID = dt.Rows[0]["AppID"].ToString();
                    apiHash = dt.Rows[0]["API_HASH"].ToString();
                    phonenumber = dt.Rows[0]["PHONE_NUMBER_LOGIN"].ToString();
                    login(apiLocal,appID,apiHash, phonenumber);
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
    }
}
