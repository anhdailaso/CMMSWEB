using Dapper;
using System.Data;
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
        public List<AcceptMaintenanceViewModel> GetListAcceptMaintenance(string username, int languages, DateTime? tngay, DateTime? dngay)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "Maintenance");
                p.Add("@iLoai", 2);
                p.Add("@TNgay", "01/01/2022");
                p.Add("@DNgay", "01/01/2022");
                p.Add("@UName", username);
                p.Add("@MS_MAY","");
                p.Add("@MS_BP", "");
                p.Add("@MS_PT", "");
                p.Add("@NNgu", languages);
                p.Add("@bCOT1", "");

                //int TotalRows = p.Get<int>("@TotalRows");
                List<AcceptMaintenanceViewModel>? res = _dapper.GetAll<AcceptMaintenanceViewModel>("spWBaoTri", p, CommandType.StoredProcedure);
                return res;
            }
            catch
            {
                return null;
            }
        }
    }
}
