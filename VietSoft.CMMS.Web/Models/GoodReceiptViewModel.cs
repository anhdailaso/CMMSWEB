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
    }
}
