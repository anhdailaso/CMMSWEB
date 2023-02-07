using VietSoft.CMMS.Web.Models;
using VietSoft.CMMS.Web.Models.Maintenance;

namespace VietSoft.CMMS.Web.IServices
{
    public interface IMaintenanceService
    {
        List<AcceptMaintenanceViewModel> GetListAcceptMaintenance(string username, int languages, DateTime? tngay, DateTime? dngay);
        TicketMaintenanceViewModel GetTicketMaintenanceByDevice(string userName, string deviceId);
        IEnumerable<WorkOrdersViewModel> GetWorkOrderList(string userName, string deviceId, string ticketId);
        IEnumerable<WorkOrderDetailViewModel> GetJobList(string userName, string deviceId);
        IEnumerable<SuppliesViewModel> GetSuppliesList(string userName, string deviceId, string deptId);
        IEnumerable<LogWorkViewModel> GetLogWorkList(string ticketId);
        IEnumerable<TreeViewModel> GetViewCauseOfDamageList(string deviceId);
        IEnumerable<TreeViewModel> GetInputCauseOfDamageList(string ticketId, string deviceId);

        ResponseViewModel SaveSupplies(string deviceId, string ticketId, string userName, int workId, string dept, string json);
        ResponseViewModel SaveMaintenanceWork(string deviceId, string ticketId, string userName, string json);
        ResponseViewModel SaveLogWork(string ticketId, string userName, string json);

    }
}
