using VietSoft.CMMS.Web.Models;

namespace VietSoft.CMMS.Web.IServices
{
    public interface IHistoryService
    {
        List<HistoryViewModel> GetListHistory(string username, int languages, DateTime? tngay, DateTime? dngay, string ms_may, bool tt_phutung, string ms_bp, string ms_pt ,int pageIndex, int pageSize);
    }
}
