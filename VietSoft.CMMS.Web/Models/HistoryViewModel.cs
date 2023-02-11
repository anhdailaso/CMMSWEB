namespace VietSoft.CMMS.Web.Models
{
    public class HistoryViewModel
    {
        public int LOAI { get; set; }
        //1 CONG_VIEC
        //2 PT
        //3 HC MAY
        //4 HC PHU TUNG
        public string NGAY { get; set; }
        public string MA_BP { get; set; }
        public string MA_PT { get; set; }
        public int SL_THAY_THE { get; set; }
    }
}
