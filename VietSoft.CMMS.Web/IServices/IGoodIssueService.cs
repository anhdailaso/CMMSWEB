using Microsoft.AspNetCore.Mvc;
using VietSoft.CMMS.Web.Models;

namespace VietSoft.CMMS.Web.IServices
{
    public interface IGoodIssueService
    {
        List<GoodIssueViewModel> GetListGoodIssue(string username, int languages, DateTime? tngay, DateTime? dngay, string mskho);
        List<DanhSachPhuTungXuatKhoModel> GetListPhuTungXuat(string username, int languages, string mspx);
        public List<ChonDanhSachPhuTungXuatModel> GetListChonPhuTungXuat(bool theobt, string username, int languages, string mspx);
        GoodIssueDetailsModel GetGoodIssueDetails(string username, int languages, string mspn, int mskho);
        string GetMaybyPhieuBaoTri(string mspbt);
        BaoCaoXuatNhapTonViewModel GetBaoCaoNhapXuatTon(string username, int languages, DateTime? tngay, DateTime? dngay, int mskho, string mspt);
        ResponseViewModel DeletePhieuXuatKho(string mspx, string userName, int languages);
        ResponseViewModel DeletePhuTungXuatXuatKho(string mspt, string mspn, string mspx, int languages);
        ResponseViewModel ScanPhuTung(string macode, string mspx, int languages);
        ResponseViewModel LockPhieuXuatKho(string mspx);

        ResponseViewModel SavePhieuXuatKho(GoodIssueDetailsModel model, string userName);
        ResponseViewModel AddPhuTungXuat(string username, string data, string mspx, int languages);
    }
}
