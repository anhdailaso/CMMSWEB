﻿namespace VietSoft.CMMS.Web.Models.Maintenance
{
    public class TicketMaintenanceViewModel
    {
        public string MS_PHIEU_BAO_TRI { get; set; }
        public DateTime NGAY_KT_KH { get; set; }
        public string S_NGAY_KT_KH { get; set; }
        public int MS_LOAI_BT { get; set; }
        public int MS_UU_TIEN { get; set; }
        public string? TINH_TRANG_MAY { get; set; }
        public string? USERNAME { get; set; }
        public int QUYEN_MENU { get; set; }
        public int QUYEN_CN { get; set; }

        public string GHI_CHU { get; set; }
        public int THEM { get; set; }

    }
}
