namespace VietSoft.CMMS.Web.Models.Maintenance
{
    public class SaveInputCauseOfDamageListModel
    {
        public string MS_PHIEU_BAO_TRI { get; set; }
        public IEnumerable<CauseOfDamageModel> CauseOfDamageModels { get; set; }
    }
}
