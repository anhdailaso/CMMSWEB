using System.ComponentModel.DataAnnotations;
using VietSoft.CMMS.Web.Resources;

namespace VietSoft.CMMS.Web.Models
{
    public class MyEcomaintViewModel
    {
        public string MS_MAY { get; set; }
        public string TEN_MAY { get; set; }
        public int YC { get; set; }
        public int PBT { get; set; }
        public int GSTT { get; set; }
        public int TREYC { get; set; }
        public int TREBT { get; set; }
        public int TREGS { get; set; }
        public int MUC_YC { get; set; }
        public int MUC_BT { get; set; }
        public int MUC_GS { get; set; }
    }
}
