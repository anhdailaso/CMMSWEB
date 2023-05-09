using System;
using System.Drawing;

namespace VietSoft.CMMS.Web.Models
{
    public class MoveDeviceModel
    {
        public bool CHON { get; set; }
        public string MS_MAY { get; set; }
        public string TEN_MAY { get; set; }
        public DateTime? NGAY_CHUYEN { get; set; }
        public string KHO_DI { get; set; }
        public string TEN_KHO_DI { get; set; }
        public string KHO_DEN { get; set; }
        public string TEN_KHO_DEN { get; set; }
        public DateTime? NGAY_NHAN { get; set; }
        public int SO_NGAY { get; set; }
    }
    public class IventoryDeviceModel
    {
        public bool CHON { get; set; }
        public string MS_MAY { get; set; }
        public string TEN_MAY { get; set; }
        public DateTime NGAY_SCAN { get; set; }
        public string MS_KHO { get; set; }
        public string TEN_KHO { get; set; }
    }
}
