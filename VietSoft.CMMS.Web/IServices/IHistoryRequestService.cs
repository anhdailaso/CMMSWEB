using VietSoft.CMMS.Web.Models;

namespace VietSoft.CMMS.Web.IServices
{
    public interface IHistoryRequestService
    {
        List<HistoryRequestViewModel> GetListHistoryRequest(string username, int languages, DateTime? tngay, DateTime? dngay, string ms_may, string idNguoiYC);
        ViewChitietPhieuBaoTriModel ViewChiTietPBT(string username, int languages, string mspbt);

    }
}
