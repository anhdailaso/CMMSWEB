namespace VietSoft.CMMS.Web.Models
{
    public class JsonResponseViewModel
    {
        public string ResponseMessage { get; set; }
        public int ResponseCode { get; set; }
        public object Data { get; set; }
    }
}
