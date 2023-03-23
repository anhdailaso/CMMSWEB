using VietSoft.CMMS.Core.Models;
using VietSoft.CMMS.Web.Models;
using VietSoft.CMMS.Web.Models.Maintenance;

namespace VietSoft.CMMS.Web.IServices
{
    public interface IMaintenanceService
    {
        TicketMaintenanceViewModel GetTicketMaintenanceByDevice(string userName, string deviceId, bool isNewTicket);
        TicketMaintenanceViewModel GetTicketMaintenanceByDevice(string mspbt);
        IEnumerable<WorkOrdersViewModel> GetWorkOrderList(string userName, string deviceId, string ticketId);
        IEnumerable<WorkOrderDetailViewModel> GetJobList(string userName, string deviceId, string ticketId);
        IEnumerable<SuppliesViewModel> GetSuppliesList(string userName, string deviceId, string deptId, string ticketId);
        IEnumerable<LogWorkViewModel> GetLogWorkList(string ticketId, string userName);
        IEnumerable<InventoryViewModel> GetListInventory(string ticketId, string mskho);
        IEnumerable<TreeViewModel> GetViewCauseOfDamageList(string deviceId, string keyWork);
        IEnumerable<TreeViewModel> GetInputCauseOfDamageList(string ticketId, string deviceId);
        ResponseViewModel SaveSupplies(string deviceId, string ticketId, string userName, int workId, string dept, string json);
        public ResponseViewModel Backlog(string ticketId, string userName, int workId, string dept);
        ResponseViewModel SaveMaintenanceWork(string deviceId, string ticketId, string userName, string json);
        ResponseViewModel SaveLogWork(string ticketId, string userName, string json);
        ResponseViewModel SaveWorkOrder(string ticketId, DateTime date, int categoryTicketId, int priorityId, string statusDevice, string userName, string deviceId);
        ResponseViewModel CompletedWorkOrder(string ticketId, string userName, string deviceId);
        ResponseViewModel SaveInputCauseOfDamageList(string ticketId, string json);

        
        List<AcceptMaintenanceModel> GetListAcceptMaintenance(string username, int languages, DateTime? tngay, DateTime? dngay);
        BaseResponseModel SaveAcceptMaintenance(string username, AcceptWorkOrderModel model);
    }
}
