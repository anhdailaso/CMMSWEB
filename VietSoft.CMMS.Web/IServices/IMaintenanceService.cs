using VietSoft.CMMS.Core.Models;
using VietSoft.CMMS.Web.Models;

namespace VietSoft.CMMS.Web.IServices
{
    public interface IMaintenanceService
    {
        List<AcceptMaintenanceModel> GetListAcceptMaintenance(string username, int languages, DateTime? tngay, DateTime? dngay);
         BaseResponseModel SaveAcceptMaintenance(string username, string mspbt);
    }
}
