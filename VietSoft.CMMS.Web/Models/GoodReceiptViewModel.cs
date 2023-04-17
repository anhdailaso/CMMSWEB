using System.ComponentModel.DataAnnotations;
using VietSoft.CMMS.Web.Resources;

namespace VietSoft.CMMS.Web.Models
{
    public class GoodReceiptViewModel
    {
        public string MS_DH_NHAP_PT { get; set; }
        public string DANG_NHAP { get; set; }
        public DateTime NGAY { get; set; }
        public string TEN { get; set; }

        public bool LOCK { get; set; }
        public string USER_LAP { get; set; }
    }

    public class GoodReceiptDetailsModel
    {
        public string MS_DH_NHAP_PT { get; set; }
        public string MS_KHO { get; set; }
        public DateTime NGAY { get; set; }
        public int MS_DANG_NHAP { get; set; }
        public string MS_DDH { get; set; }
        public string MS_DHX { get; set; }
        public string NGUOI_NHAP { get; set; }
        public string SO_CHUNG_TU { get; set; }
        //[DisplayFormat(DataFormatString = "{dd/mm/yyyy}")]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:dd/MM/yyyy}", ApplyFormatInEditMode = true)]
        public DateTime? NGAY_CHUNG_TU { get; set; }
        public string GHI_CHU { get; set; }
        public bool LOCK { get; set; }
        public string USER_LAP { get; set; }
        public bool THEM { get; set; }
        public bool QUYEN { get; set; }
    }

    public class DanhSachPhuTungNhapKhoModel
    {
        public string MS_PT { get; set; }
        public float SO_LUONG { get; set; }
        public float DON_GIA { get; set; }
        public float VAT { get; set; }
        public string NGOAI_TE { get; set; }
        public int MS_VI_TRI { get; set; }
        public string VI_TRI { get; set; }
        public bool XOA { get; set; }

    }
    public class PhuTungModel
    {
        public string MS_PT { get; set; }
        public string TEN_PT { get; set; }
    }

    public class ViTriNhapKhoModel
    {
        public string MS_DH_NHAP_PT { get; set; }
        public string MS_PT { get; set; }
        public int MS_VI_TRI { get; set; }
        public string TEN_VI_TRI { get; set; }
        public float SL_VT { get; set; }
        
    }

    public class PhieuNhapKhoChiPhiModel
    {
        public string MS_DH_NHAP_PT { get; set; }
        public int MS_CHI_PHI { get; set; }
        public string TEN_CP { get; set; }
        public int DANG_PB { get; set; }
        public float TONG_CP { get; set; }
        public string GHI_CHU { get; set; }
    }

    public class PhieuNhapKhoPhuTungMore
    {
        public string MS_DH_NHAP_PT { get; set; }
        public string MS_PT { get; set; }
        public string XUAT_XU { get; set; }
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:dd/MM/yyyy}", ApplyFormatInEditMode = true)]
        public DateTime? BAO_HANH_DEN_NGAY { get; set; }
        [DisplayFormat(DataFormatString = "{0:N5}", ApplyFormatInEditMode = true)]
        public float TY_GIA { get; set; }
    }
}

