namespace VietSoft.CMMS.Web.Models.Maintenance
{
    public class TicketMaintenanceViewModel
    {
        public string MS_PHIEU_BAO_TRI { get; set; }
        public string S_NGAY_LAP { get; set; }
        public DateTime NGAY_LAP { get; set; }
        public DateTime NGAY_BD_KH { get; set; }
        public string S_NGAY_BD_KH { get; set; }
        public DateTime NGAY_KT_KH { get; set; }
        public string S_NGAY_KT_KH { get; set; }
        public int MS_LOAI_BT { get; set; }
        public int MS_UU_TIEN { get; set; }
        public string? TINH_TRANG_MAY { get; set; }
        public string? USERNAME { get; set; }
        public int QUYEN_MENU { get; set; }
        public int QUYEN_CN { get; set; }
        public int HU_HONG { get; set; }

        public string GHI_CHU { get; set; }
        public int THEM { get; set; }

    }

    public class MorningToringViewModel
    {
        public int STT { get; set; }
        public string SO_PHIEU { get; set; }
        public DateTime NGAY_KT { get; set; }
        public DateTime NGAY_KH { get; set; }
        public int MUC_UU_TIEN { get; set; }
        public string NHAN_XET { get; set; }
        public string? USERNAME { get; set; }
        public int QUYEN_MENU { get; set; }
        public int HOAN_THANH { get; set; }
        public int THEM { get; set; }

    }
}


