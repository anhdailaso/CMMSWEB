namespace VietSoft.CMMS.Web.Models.Maintenance
{
    public class WorkOrderDetailViewModel
    {
        public string MS_PHIEU_BAO_TRI { get; set; }
        public string MS_BO_PHAN { get; set; }
        public string TEN_BO_PHAN { get; set; }
        public int MS_CV { get; set; }
        public string MO_TA_CV { get; set; }
        public string THAO_TAC { get; set; }
        public string TIEU_CHUAN_KT { get; set; }
        public string YEU_CAU_NS { get; set; }
        public string YEU_CAU_DUNG_CU { get; set; }
        public string MS_PT { get; set; }
        public string TEN_PT { get; set; }
        public string MS_VI_TRI_PT { get; set; }
        public double SL_CT { get; set; }
        public double SL_KH { get; set; }
        public double SL_TT { get; set; }
        public string PATH_HD { get; set; }
        public string PATH_IMAGE { get; set; }
    }

    public class NguoiThucHienModel
    {
        public string MS_CONG_NHAN { get; set; }
        public string TEN_CONG_NHAN { get; set; }
        public bool CHON { get; set; }
        public bool XOA { get; set; }

    }
    public class CapNhatCa
    {
        public int ID_CA { get; set; }
        public DateTime NGAY_BD { get; set; }
        public DateTime NGAY_KT { get; set; }
    }
    public class ThoiGianNgungMayModel
    {
        public int MS_NGUYEN_NHAN { get; set; }
        public string TEN_NGUYEN_NHAN { get; set; }
        public int ID_CA { get; set; }
        public string TEN_CA { get; set; }
        public DateTime TU_GIO { get; set; }
        public DateTime DEN_GIO { get; set; }
    }


    public class WorkOrdersViewModel
    {
        public string MS_PHIEU_BAO_TRI { get; set; }
        public string MS_BO_PHAN { get; set; }
        public string TEN_BO_PHAN { get; set; }
        public int MS_CV { get; set; }
        public string MO_TA_CV { get; set; }
        public string THAO_TAC { get; set; }
        public string TIEU_CHUAN_KT { get; set; }
        public string YEU_CAU_NS { get; set; }
        public string YEU_CAU_DUNG_CU { get; set; }
        public string PATH_HD { get; set; }
        public string Path { get; set; }
        public string Path64 { get; set; }
        public IEnumerable<WorkOrderDetailViewModel> WorkOrderDetailViewModels { get; set; }

    }
}
