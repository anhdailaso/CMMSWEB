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
using Microsoft.ApplicationBlocks.Data;

namespace VietSoft.CMMS.Web.Services
{
    public class ChartService : IChartService
    {
        private readonly IDapperService _dapper;
        private readonly ILogger<HomeService> _logger;
        public ChartService(IDapperService dapper)
        {
            _dapper = dapper;
        }
       
        public IEnumerable<GetSituationWOObj> GetSituationWO()
        {
            try
            {

            var p = new DynamicParameters();
            p.Add("@NNgu", 0);
            return _dapper.GetAll<GetSituationWOObj>("spGetSituationWO", p, CommandType.StoredProcedure).ToList();

            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public IEnumerable<GetDeviceInfoObj> GetDeviceInfo(string Username)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@NNgu", 0);
                p.Add("@username", Username);
                return _dapper.GetAll<GetDeviceInfoObj>("spGetDeviceInfo", p, CommandType.StoredProcedure).ToList();
            }
            catch (Exception ex)
            {
                return null; 
            }
            
        }

        public IEnumerable<GetDeviceStatusObj> GetDeviceStatus(string Username)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@toDate", DateTime.Now);
                p.Add("@username", Username);
                p.Add("@lang", 0);
                return _dapper.GetAll<GetDeviceStatusObj>("spGetDeviceStatus", p, CommandType.StoredProcedure).ToList();
            }
            catch (Exception ex)
            {
                return null;
            }

        }

        public IEnumerable<GetSituationWOColumnObj> GetSituationWOColumn(string Username)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@NNgu", 0);
                return _dapper.GetAll<GetSituationWOColumnObj>("spGetSituationWOColumn", p, CommandType.StoredProcedure).ToList();
            }
            catch (Exception ex)
            {
                return null;
            }

        }

        public int GetSoMay()
        {
            int resulst = Convert.ToInt32(SqlHelper.ExecuteScalar(_dapper.GetDbconnection().ConnectionString, CommandType.Text, "SELECT COUNT(*) FROM (SELECT MS_HE_THONG AS MS_HT, MS_MAY, MS_HIEN_TRANG FROM dbo.MGetMayUserNgay(GETDATE(), 'admin', '-1', -1, -1, '-1', '-1', '-1', 0) union SELECT DISTINCT NULL AS MS_HT, MS_MAY, MS_HIEN_TRANG FROM dbo.MAY A WHERE A.MS_MAY NOT IN(SELECT MS_MAY FROM MAY_BO_PHAN_CHIU_PHI) OR A.MS_MAY NOT IN(SELECT MS_MAY FROM MAY_HE_THONG) OR A.MS_MAY NOT IN(SELECT MS_MAY FROM MAY_NHA_XUONG) OR A.MS_NHOM_MAY IS NULL OR A.MS_HIEN_TRANG IS NULL OR A.MS_MAY  IN(SELECT MS_MAY FROM MAY_BO_PHAN_CHIU_PHI WHERE MS_BP_CHIU_PHI IS NULL) OR A.MS_MAY  IN(SELECT MS_MAY FROM MAY_HE_THONG  WHERE MS_HE_THONG IS NULL) OR A.MS_MAY  IN(SELECT MS_MAY FROM MAY_NHA_XUONG  WHERE MS_N_XUONG IS NULL))A"));
            return resulst;
        }
    }
}
