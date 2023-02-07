namespace VietSoft.CMMS.Web.Models.Maintenance
{
    public class SaveMaintenanceWorkModel
    {
        public string MS_PHIEU_BAO_TRI { get; set; }
        public string DEVICE_ID { get; set; }

        public IEnumerable<WorkList> WorkList { get; set; }
    }

    public class WorkList
    {
        public string MS_BO_PHAN { get; set; }
        public string TEN_BO_PHAN { get; set; }
        public int MS_CV { get; set; }
        public string MO_TA_CV { get; set; }
    }

    public class SaveSuppliesModel
    {
        public string MS_PHIEU_BAO_TRI { get; set; }
        public string DEVICE_ID { get; set; }
        public int MS_CV { get; set; }
        public string MS_BO_PHAN { get; set; }
        public IEnumerable<SuppliesViewModel>  SuppliesList { get; set; }
    }

    public class SaveLogWorkModel
    {
        public string MS_PHIEU_BAO_TRI { get; set; }
        public IEnumerable<LogWorkViewModel>  LogWorkList { get; set; }
    }
}
