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
                p.Add("@DNgay", dngay.ToStringDate("MM/dd/yyyy"));
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
            catch
            {
                return null;
            }
        }

    }
}
