using Dapper;
using VietSoft.CMMS.Web.Resources;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Models;
using VietSoft.CMMS.Web.Serilog;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.Data.SqlClient;
using VietSoft.CMMS.Web.Helpers;
using System.Reflection;
using System.Data;
using VietSoft.CMMS.Core.Models;

namespace VietSoft.CMMS.Web.Services
{
    public class HomeService :  IHomeService
    {
        private readonly IDapperService _dapper;
        private readonly ILogger<HomeService> _logger;
        public HomeService(IDapperService dapper)
        {
            _dapper = dapper;
        }
        public List<MyEcomaintViewModel> GetMyEcomain(string username, int languages, DateTime? dngay, string ms_nx, string may,bool xuly,int pageIndex, int pageSize)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "GET_MYECOMAINT");
                p.Add("@DNgay", dngay);
                p.Add("@UserName", username);
                p.Add("@MsNXuong", ms_nx);
                p.Add("@deviceID", may == "" ? "-1" : may);
                p.Add("@NNgu", languages);
                p.Add("@bcot1", xuly);
                //int TotalRows = p.Get<int>("@TotalRows");
                List<MyEcomaintViewModel>? res =  _dapper.GetAll<MyEcomaintViewModel>("spCMMSWEB", p, CommandType.StoredProcedure).OrderBy(x=>x.TEN_MAY).ToList();
                 return res;
            }
            catch
            {
                return null;
            }
            //List<MyEcomaintViewModel> list = null;
            //try
            //{
            //    List<SqlParameter> listParameter = new List<SqlParameter>();
            //    listParameter.Add(new SqlParameter("@TNgay", tngay));
            //    listParameter.Add(new SqlParameter("@DNgay", dngay));
            //    listParameter.Add(new SqlParameter("@UserName", username));
            //    listParameter.Add(new SqlParameter("@MsNXuong", ms_nx));
            //    listParameter.Add(new SqlParameter("@MsMay", may == "" ? "-1" : may));
            //    listParameter.Add(new SqlParameter("@GiaiDoan", giaidoan));
            //    listParameter.Add(new SqlParameter("@NNgu", languages));
            //    list = DBUtils.ExecuteSPList<MyEcomaintViewModel>("spGetPBTGSTT", listParameter, AppName.Model1);
            //}
            //catch (Exception ex)
            //{
            //}
            //return list;
        }
        public List<MonitoringParametersByDevice> GetMonitoringParametersByDevice(string username, int languages, string may, int isDue, int stt)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "MORNINGTORING");
                p.Add("@UserName", username);
                p.Add("@NNgu", languages);
                p.Add("@deviceID", may == "" ? "-1" : may);
                p.Add("@isDue", isDue);
                p.Add("@stt", stt);
                List<MonitoringParametersByDevice>? res = _dapper.GetAll<MonitoringParametersByDevice>("spCMMSWEB", p, CommandType.StoredProcedure);
                return res;
            }
            catch(Exception ex)
            {
                return null;
            }
        }

        public UserRequestViewModel GetUserRequest(string msmay)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "GetUserRequest");
                p.Add("@deviceID", msmay);
                var res = _dapper.Execute<UserRequestViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return new UserRequestViewModel();
            }
        }

        public BaseResponseModel SaveMonitoring(string username,string data)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "SAVE_MONINGTORING");
                p.Add("@UserName", username);
                p.Add("@json", data);
                var res = _dapper.Execute<BaseResponseModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return new BaseResponseModel();
            }
        }

        public BaseResponseModel SaveUserRequest(string username,UserRequestViewModel request)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "SAVE_USEREQUEST");
                p.Add("@deviceID", request.MS_MAY);
                p.Add("@icot1", request.DUYET);
                p.Add("@icot2", request.MS_UU_TIEN);
                p.Add("@icot3", request.STT_VAN_DE);
                p.Add("@scot1", request.MO_TA_TINH_TRANG);
                p.Add("@scot2", request.YEU_CAU);
                p.Add("@scot3", request.NGUOI_YEU_CAU);
                p.Add("@stt", request.STT);
                p.Add("@dCot1", request.NGAY_XAY_RA);
                p.Add("@bCot1", request.HONG);
                p.Add("@UserName", username);
                var res = _dapper.Execute<BaseResponseModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return new BaseResponseModel();
            }
        }


    }
}
