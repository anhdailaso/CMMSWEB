using Dapper;
using System.Data;
using VietSoft.CMMS.Core.Models;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Models;

namespace VietSoft.CMMS.Web.Services
{
    public class MaintenanceService : IMaintenanceService
    {
        private readonly IDapperService _dapper;
        public MaintenanceService(IDapperService dapper)
        {
            _dapper = dapper;
        }
        public List<AcceptMaintenanceModel> GetListAcceptMaintenance(string username, int languages, DateTime? tngay, DateTime? dngay)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "ACCEPT_MAINTENANCE");
                p.Add("@UserName", username);
                p.Add("@dCot1", tngay.ToStringDate("MM/dd/yyyy"));
                p.Add("@dCot2", dngay.ToStringDate("MM/dd/yyyy"));
                //int TotalRows = p.Get<int>("@TotalRows");
                List<AcceptMaintenanceModel>? res = _dapper.GetAll<AcceptMaintenanceModel>("spCMMSWEB", p, CommandType.StoredProcedure);
                return res;
            }
            catch
            {
                return null;
            }
        }

        public BaseResponseModel SaveAcceptMaintenance(string username, string mspbt)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "ACCEPTANCE_WORDORDER");
                p.Add("@UserName", username);
                p.Add("@sCot1", mspbt);
                var res = _dapper.Execute<BaseResponseModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res;
            }
            catch 
            {
                return new BaseResponseModel();
            }
        }
    }
}
