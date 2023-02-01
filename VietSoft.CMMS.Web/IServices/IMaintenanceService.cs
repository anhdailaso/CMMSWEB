using VietSoft.CMMS.Web.Models;

namespace VietSoft.CMMS.Web.IServices
{
    public interface IMaintenanceService
    {
        List<AcceptMaintenanceViewModel> GetListAcceptMaintenance(string username, int languages, DateTime? tngay, DateTime? dngay);
    }
}
