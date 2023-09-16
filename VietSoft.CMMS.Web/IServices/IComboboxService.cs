using Microsoft.AspNetCore.Mvc.Rendering;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.Models;
using VietSoft.CMMS.Web.Models.Maintenance;

namespace VietSoft.CMMS.Web.IServices
{
    public interface IComboboxService
    {
        SelectList DangPhanBo(int NNgu);
        SelectList CboNgoaiTe();
        SelectList DanhSachKho(string Username);
        //SelectList DanhSachDangNhap();
        SelectList DanhSachNguyenNhan(string msmay, bool CoAll, int NNgu);
        SelectList DanhSachCa(int NNgu);
        SelectList DanhSachLoaiBT();
        SelectList DanhSachPhuTung(int NNgu);
        SelectList GetCbbDiaDiem(string UserName, int NNgu, int CoAll, int Myeco = 0);
        SelectList GetLoaiMayAll(string UserName, int NNgu, int CoAll);
        SelectList GetCbbHeThong(string UserName, int NNgu, int CoAll);
        SelectList GetCbbDangNhap(string Username, int NNgu, int CoAll);
        SelectList GetCbbTrong();
        SelectList GetCbbDangxuat(string Username, int NNgu, int CoAll);
        SelectList GetCbbPhieuBaoTriXuat(string msmay);
        SelectList GetCbbBoPhanChiuPhi(string Username);

        SelectList GetCbbDDH(string Username, int NNgu, int CoAll, int dexuat);
        SelectList GetCbbNguoiNhap(string Username, int NNgu, int CoAll, int khachhang, int vaitro);
        SelectList GetCbbNguoiXuat(string Username, int NNgu, int CoAll, int khachhang, int vaitro);

        SelectList GetCbbLoaiMay(string UserName, int NNgu, int CoAll);
        SelectList GetCbbMay(string DD, int DC, string Username, int NNgu, int CoAll);
        SelectList GetCbbLoaiCV(string UserName, int NNgu, int CoAll);


        SelectList LoadListUuTien(int NN);

        //Đạt sửa 10101999
        SelectList GetCbbBoPhan(string msmay, string Username, int NNgu, int CoAll);
        SelectList GetCbbBoPhan(string msmay, string Username, int NNgu);
        SelectList GetCbbCongViec(string msmay, string msbp, int NNgu);
        SelectList GetCbbPhuTung(string msmay, string msbp, string Username, int NNgu, int CoAll);

        //Đạt sửa 26122022
        SelectList GetCbbNYC(string Username, int NNgu, int CoAll);

        IEnumerable<MaintenanceCategoryViewModel> GetMaintenanceCategoy(int msHT);
        IEnumerable<PriorityCategoryViewModel> GetPriorityCategory(int NN);
    }
}
