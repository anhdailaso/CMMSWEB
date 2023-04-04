using VietSoft.CMMS.Web.Models;

namespace VietSoft.CMMS.Web.IServices
{
    public interface IGoodReceiptService
    {
        List<GoodReceiptViewModel> GetListGoodReceipt(string username, int languages, DateTime? tngay, DateTime? dngay, string mskho);
        List<DanhSachPhuTungNhapKhoModel> GetListPhuTungNhap(string username, int languages, string mspn);
        List<PhuTungModel> GetListChonPhuTungNhap(string username, int languages, string mspn);
        GoodReceiptDetailsModel GetGoodReceiptDetails(string username, int languages, string mspn, int mskho);
        PhieuNhapKhoPhuTungMore GetPhieuNhapKhoPhuTungMore(string username, int languages, string mspn, string mspt);
        List<PhieuNhapKhoChiPhiModel> GetCHiPhiPhieuNhapKho(int languages, string mspn, int iloai);
        List<ViTriNhapKhoModel> GetViTriNhapKho(string username, int languages, string mspn, string mspt);
        ResponseViewModel DeletePhieuNhapKho(string mspn, string userName);
    }
}
