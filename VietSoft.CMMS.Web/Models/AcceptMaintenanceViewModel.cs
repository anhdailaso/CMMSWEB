using System.ComponentModel.DataAnnotations;
using VietSoft.CMMS.Web.Resources;

namespace VietSoft.CMMS.Web.Models
{
    public class AcceptMaintenanceModel
    {
        public string MS_PHIEU_BAO_TRI { get; set; }
        public string MS_MAY { get; set; }
        public string TEN_MAY { get; set; }
        public string NGAY_HOAN_THANH { get; set; }
        public string TEN_LOAI_BT { get; set; }
        public string MS_BO_PHAN { get; set; }
        public string TEN_BO_PHAN { get; set; }
        public int MS_CV { get; set; }
        public string MO_TA_CV { get; set; }
        public string MS_PT { get; set; }
        public string TEN_PT { get; set; }
        public float SL_TT { get; set; }

    }
    public class SParePartViewModel
    {
        public string MS_PHIEU_BAO_TRI { get; set; }
        public string MS_MAY { get; set; }
        public string MS_BO_PHAN { get; set; }
        public int MS_CV { get; set; }
        public string MS_PT { get; set; }
        public string TEN_PT { get; set; }
        public float SL_TT { get; set; }
    }
    public class JobViewModel
    {
        public string MS_PHIEU_BAO_TRI { get; set; }
        public string MS_MAY { get; set; }
        public string MS_BO_PHAN { get; set; }
        public string TEN_BO_PHAN { get; set; }
        public int MS_CV { get; set; }
        public string MO_TA_CV { get; set; }
    }
    public class AcceptMaintenanceViewModel
    {
        public string MS_PHIEU_BAO_TRI { get; set; }
        public string MS_MAY { get; set; }
        public string TEN_MAY { get; set; }
        public string NGAY_HOAN_THANH { get; set; }
        public string TEN_LOAI_BT { get; set; }
        public List<JobViewModel> JobViewModel { get; set; }
        public List<SParePartViewModel> SParePartViewModel { get; set; }
    }
}
