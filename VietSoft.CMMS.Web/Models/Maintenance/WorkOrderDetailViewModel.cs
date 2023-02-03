namespace VietSoft.CMMS.Web.Models.Maintenance
{
    public class WorkOrderDetailViewModel
    {
        public string MS_PHIEU_BAO_TRI { get; set; }
        public string MS_BO_PHAN { get; set; }
        public string TEN_BO_PHAN { get; set; }
        public int MS_CV { get; set; }
        public string MO_TA_CV { get; set; }
        public string MS_PT { get; set; }
        public string TEN_PT { get; set; }
        public string MS_VI_TRI_PT { get; set; }
        public double SL_TT { get; set; }

    }

    public class WorkOrdersViewModel
    {
        public string MS_PHIEU_BAO_TRI { get; set; }
        public string MS_BO_PHAN { get; set; }
        public string TEN_BO_PHAN { get; set; }
        public int MS_CV { get; set; }
        public string MO_TA_CV { get; set; }
        public IEnumerable<WorkOrderDetailViewModel> WorkOrderDetailViewModels { get; set; }

    }
}
