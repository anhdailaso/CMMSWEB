using System.ComponentModel.DataAnnotations;
using VietSoft.CMMS.Web.Resources;

namespace VietSoft.CMMS.Web.Models
{
    public class GoodIssueViewModel
    {
        public string MS_DH_XUAT_PT { get; set; }
        public string SO_PHIEU_XN { get; set; }
        public string DANG_XUAT { get; set; }
        public DateTime NGAY { get; set; }
        public string TEN { get; set; }
        public bool LOCK { get; set; }
        public string USER_LAP { get; set; }
    }
    public class GoodIssueDetailsModel
    {
        public string MS_DH_XUAT_PT { get; set; }
        public string SO_PHIEU_XN { get; set; }
        public int MS_KHO { get; set; }
        public DateTime NGAY { get; set; }
        public int MS_DANG_XUAT { get; set; }
        public string MS_PHIEU_BAO_TRI { get; set; }
        public int MS_BP_CHIU_PHI { get; set; }
        public string TEN_BP_CHIU_PHI { get; set; }
        public string NGUOI_NHAN { get; set; }
        public string SO_CHUNG_TU { get; set; }

        public DateTime? NGAY_CHUNG_TU { get; set; }
        public string GHI_CHU { get; set; }
        public bool LOCK { get; set; }
        public string USER_LAP { get; set; }
        public bool THEM { get; set; }
        public bool QUYEN { get; set; }

    }

    public class DanhSachPhuTungXuatKhoModel
    {
        public string MS_PT { get; set; }
        public string TEN_PT { get; set; }
        public string MS_DH_NHAP_PT { get; set; }
        public float SO_LUONG { get; set; }
        public int MS_VI_TRI { get; set; }
        public string VI_TRI { get; set; }
        public bool XOA { get; set; }
    }

    public class ChonDanhSachPhuTungXuatModel
    {
        public string MS_PT { get; set; }
        public string MS_DH_NHAP_PT { get; set; }
        public float SL_XUAT { get; set; }
        public float SL_TON { get; set; }
    }

}

