using System.ComponentModel.DataAnnotations;
using VietSoft.CMMS.Web.Resources;

namespace VietSoft.CMMS.Web.Models
{
    public class BaoCaoXuatNhapTonViewModel
    {
        public string MS_PT { get; set; }
        public string TEN_PT { get; set; }
        public string TEN_DVT { get; set; }
        public float TON_DAU_KY { get; set; }
        public float NHAP_TRONG_KY { get; set; }
        public float XUAT_TRONG_KY { get; set; }
        public float TON_CUOI_KY { get; set; }
    }
}

