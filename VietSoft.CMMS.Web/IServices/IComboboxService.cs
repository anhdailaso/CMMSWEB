using Microsoft.AspNetCore.Mvc.Rendering;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.Models;

namespace VietSoft.CMMS.Web.IServices
{
    public interface IComboboxService
    {
        SelectList DanhSachNguyenNhan();
        SelectList DanhSachLoaiBT();
        SelectList GetCbbDiaDiem(string UserName, int NNgu, int CoAll);
        SelectList GetCbbHeThong(string UserName, int NNgu, int CoAll);
        SelectList GetCbbLoaiMay(string UserName, int NNgu, int CoAll);
        SelectList GetCbbMay(string DD, int DC, string Username, int NNgu, int CoAll);
        SelectList GetCbbLoaiCV(string UserName, int NNgu, int CoAll);

     
        SelectList LoadListThietBi();
        SelectList LoadListNguyenNhan();
        SelectList LoadListLoaiYC();
        SelectList LoadListUuTien(int NN);

        //Đạt sửa 10101999
        SelectList GetCbbBoPhan(string msmay,string Username, int NNgu, int CoAll);
        SelectList GetCbbPhuTung(string msmay,string msbp,string Username, int NNgu, int CoAll);

        //Đạt sửa 26122022
        SelectList GetCbbNYC(string Username, int NNgu, int CoAll);
    }
}
