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
        SelectList DanhSachNguyenNhan(int NNgu);
        SelectList DanhSachLoaiBT();
        SelectList DanhSachPhuTung(int NNgu);
        SelectList GetCbbDiaDiem(string UserName, int NNgu, int CoAll);
        SelectList GetLoaiMayAll(string UserName, int NNgu, int CoAll);
        SelectList GetCbbHeThong(string UserName, int NNgu, int CoAll);
        SelectList GetCbbDangNhap(string Username, int NNgu, int CoAll);
        SelectList GetCbbTrong();
        SelectList GetCbbDangxuat(string Username, int NNgu, int CoAll);
        SelectList GetCbbPhieuBaoTriXuat();
        SelectList GetCbbBoPhanChiuPhi(string Username);

        SelectList GetCbbDDH(string Username, int NNgu, int CoAll, int dexuat);
        SelectList GetCbbNguoiNhap(string Username, int NNgu, int CoAll, int khachhang, int vaitro);
        SelectList GetCbbNguoiXuat(string Username, int NNgu, int CoAll, int khachhang, int vaitro);

        SelectList GetCbbLoaiMay(string UserName, int NNgu, int CoAll);
        SelectList GetCbbMay(string DD, int DC, string Username, int NNgu, int CoAll);
        SelectList GetCbbLoaiCV(string UserName, int NNgu, int CoAll);


        SelectList LoadListThietBi();
        SelectList LoadListNguyenNhan();
        SelectList LoadListLoaiYC();
        SelectList LoadListUuTien(int NN);

        //Đạt sửa 10101999
        SelectList GetCbbBoPhan(string msmay, string Username, int NNgu, int CoAll);
        SelectList GetCbbPhuTung(string msmay, string msbp, string Username, int NNgu, int CoAll);

        //Đạt sửa 26122022
        SelectList GetCbbNYC(string Username, int NNgu, int CoAll);

        IEnumerable<MaintenanceCategoryViewModel> GetMaintenanceCategoy(int msHT);
        IEnumerable<PriorityCategoryViewModel> GetPriorityCategory(int NN);
    }
}
