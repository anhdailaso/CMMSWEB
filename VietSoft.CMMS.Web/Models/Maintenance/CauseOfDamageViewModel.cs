namespace VietSoft.CMMS.Web.Models.Maintenance
{
    public class CauseOfDamageModel
    {
        public string MS_MAY { get; set; }
        public string MS_BO_PHAN { get; set; }
        public string TEN_BO_PHAN { get; set; }
        public string CLASS_ID { get; set; }
        public string CLASS_CODE { get; set; }
        public string CLASS_NAME { get; set; }
        public int GR_CLASS { get; set; }
        public string PROBLEM_ID { get; set; }
        public string PROBLEM_CODE { get; set; }
        public string PROBLEM_NAME { get; set; }
        public int GR_PROLEM { get; set; }
        public string CAUSE_ID { get; set; }
        public string CAUSE_CODE { get; set; }
        public string CAUSE_NAME { get; set; }
        public int GR_CAUSE { get; set; }
        public string REMEDY_ID { get; set; }
        public string REMEDY_CODE { get; set; }
        public string REMEDY_NAME { get; set; }
        public int GR_REMEDY { get; set; }
    }

    public class CauseOfDamageListViewModel
    {
        public string MS_MAY { get; set; }
        public string MS_BO_PHAN { get; set; }
        public string TEN_BO_PHAN { get; set; }
        public string CLASS_ID { get; set; }
        public string CLASS_CODE { get; set; }
        public string CLASS_NAME { get; set; }
        public int GR_CLASS { get; set; }
        public IEnumerable<CauseOfDamageViewModel> CauseOfDamageViewModels { get; set; }
       
    }

    public class RemedialViewModel
    {
        public string REMEDY_ID { get; set; }
        public string REMEDY_CODE { get; set; }
        public string REMEDY_NAME { get; set; }
        public int GR_REMEDY { get; set; }
    }

    public class CauseOfDamageViewModel
    {
        public string CAUSE_ID { get; set; }
        public string CAUSE_CODE { get; set; }
        public string CAUSE_NAME { get; set; }
        public int GR_CAUSE { get; set; }
        public IEnumerable<RemedialViewModel> RemedialViewModels { get; set; }
    }

    public class TreeViewModel
    {
        public string ItemCode { get; set; }
        public string ItemName { get; set; }
        public string Id { get; set; }
        public string Key { get; set; }
        public double Amount { get; set; }
        public IEnumerable<object> Childs { get; set; }

    }

    public class SaveCauseOfDamageModel
    {
        public string MS_MAY { get; set; }
        public string MS_BO_PHAN { get; set; }
        public string CLASS_ID { get; set; }
        public string PROBLEM_ID { get; set; }
        public string CAUSE_ID { get; set; }
        public string REMEDY_ID { get; set; }
    }
}
