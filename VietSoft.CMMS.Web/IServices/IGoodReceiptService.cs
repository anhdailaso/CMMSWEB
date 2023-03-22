using VietSoft.CMMS.Web.Models;

namespace VietSoft.CMMS.Web.IServices
{
    public interface IGoodReceiptService
    {
        List<GoodReceiptViewModel> GetListGoodReceipt(string username, int languages, DateTime? tngay, DateTime? dngay, string mskho);
    }
}
