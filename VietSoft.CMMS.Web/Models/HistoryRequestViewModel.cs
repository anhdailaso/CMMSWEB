namespace VietSoft.CMMS.Web.Models
{
    public class HistoryRequestViewModel
    {
        public string NGAY_YC { get; set; }
        public string NGAY_DUYET { get; set; }
        public string NGAY_PBT { get; set; }
        public string MS_MAY { get; set; }
        public string TEN_MAY { get; set; }
        public string TINH_TRANG_MAY { get; set; }
        public string NGAY_KT_PBT { get; set; }

        public string MS_PHIEU_BAO_TRI { get; set; }

        public int TINH_TRANG { get; set; }
    }

    public class ViewChitietPhieuBaoTriModel
    {
        public string CONG_VIEC { get; set; }
        public string PHU_TUNG { get; set; }
        public string NGUOI_THUC_HIEN { get; set; }
        public string NGUOI_NGHIEM_THU { get; set; }
    }
}
