using VietSoft.CMMS.Core.Models;
using VietSoft.CMMS.Web.Models;
using VietSoft.CMMS.Web.Models.Maintenance;

namespace VietSoft.CMMS.Web.IServices
{
    public interface IMaintenanceService
    {
        TicketMaintenanceViewModel GetTicketMaintenanceByDevice(string mspbt,string userName, string deviceId, bool isNewTicket);
        TicketMaintenanceViewModel GetTicketMaintenanceByDevice(string mspbt);
        IEnumerable<WorkOrdersViewModel> GetWorkOrderList(string userName, string deviceId, string ticketId , int languages);
        IEnumerable<WorkOrderDetailViewModel> GetJobList(string userName, string deviceId, string ticketId, int languages);
        IEnumerable<NguoiThucHienModel> GetNguoiThucHien(string userName, string deviceId, string ticketId, int languages);
        ThoiGianNgungMayModel GetThoiGianNgungMay(string ticketId, string userName, int languages, bool add);
        IEnumerable<SuppliesViewModel> GetSuppliesList(string userName, string deviceId, string deptId, string ticketId , int languages);
        IEnumerable<LogWorkViewModel> GetLogWorkList(string ticketId, string userName);
        IEnumerable<InventoryViewModel> GetListInventory(string ticketId, string mskho);
        IEnumerable<TreeViewModel> GetViewCauseOfDamageList(string deviceId, string keyWork);
        IEnumerable<TreeViewModel> GetInputCauseOfDamageList(string ticketId, string deviceId);
        ResponseViewModel SaveSupplies(string deviceId, string ticketId, string userName, int workId, string dept, string json);
        ResponseViewModel Backlog(string ticketId, string userName, int workId, string dept);
        ResponseViewModel DeleteWork(string ticketId, string userName, int workId, string dept, int languages);
         ResponseViewModel DeleteWorkOrder(string ticketId, string userName, int languages);
        ResponseViewModel SaveMaintenanceWork(string deviceId, string ticketId, string userName, string json);
        ResponseViewModel SaveNguoiThucHien(string ticketId, string json);
        ResponseViewModel ThemCauTrucCongViec(string deviceId, string msbp, int mscv, string tenCV, int thoigian, bool them);
        ResponseViewModel SaveLogWork(string ticketId, string userName, string json);
        ResponseViewModel SaveWorkOrder(string ticketId, DateTime date, int categoryTicketId, int priorityId, string statusDevice,string lydoBT, string userName, string deviceId, int them);
        ResponseViewModel CompletedWorkOrder(string ticketId, string userName, string deviceId, int languages);
        List<CapNhatCa> CapNhatCa(DateTime TN, DateTime DN);
        ResponseViewModel SaveInputCauseOfDamageList(string ticketId, int msnn, DateTime tungay, DateTime denngay, string json, string Username);

        
        List<AcceptMaintenanceModel> GetListAcceptMaintenance(string username, int languages, DateTime? tngay, DateTime? dngay , int NNgu);
        BaseResponseModel SaveAcceptMaintenance(string username, AcceptWorkOrderModel model, int languages);
        BaseResponseModel SaveThoiGianNgungMay(string username, string mspbt, string json);
        bool CheckPhuTung(string ticketId);
        BaseResponseModel UpdateTinhTrang(string ticketId);
        List<ThoiGianNgungMayModel> GetListThoiGianNgungMay(string mspbt, int languages);
    }
}
