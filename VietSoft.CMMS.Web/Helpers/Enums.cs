namespace VietSoft.CMMS.Web.Helpers
{
    public enum ModuleType
    {
        WAREHOUSE = 1,
        PACKING = 2
    }
    public enum WarehouseType
    {
        WAREHOUSE_MATERIAL = 1,
        WAREHOUSE_PRODUCT = 2
    }
    public enum CategoryType
    {
        DS_PALLET,
        DS_KH,
        UPDATE_PALLET_VI_TRI,
        CHECK_PALLET,
        CHECK_PALLET_VI_TRI,
        PN,
        PN_HH,
        PN_CHECK_PALLET,
        PN_HH_MAU,
        PN_HH_MAU_STT_LOT,
        PN_HH_MAU_SIZE,
        PN_HH_MAU_STT,
        PN_HH_MAU_STT_LOT_TT,
        PN_CHECK_VAI,
        XCK_CHK_VAI,
        PN_DS_CUON_VAI,
        PN_CHECK_LOT,
        PN_UPDATE,
        QC_DS_CUON_VAI,
        PN_KH,
        CHD_CHECK_VAI,
        HANGLOI_UPDATE,
        PX_KH,
        PX_HH,
        PX_DS,
        PX_DS_HH,
        DS_KHO,
        QC_UPDATE,
        CHD_UPDATE,
        DDCV_UPDATE,
        DDCV_CHECK_PALLET,
        DDCV_CHECK_CUON_VAI,
        PX_CHECK_VAI,
        PX_UPDATE,
        PX_KHO_DEN,
        PN_XOA_CUON_VAI,
        KK_PKK,
        KK_CHK_PALLET,
        KK_CHK_CUON_VAI,
        KK_UPDATE,
        DT_KH,
        DT_HH,
        DT_PACKING,
        DT_TT,
        DT_THUNG,
        DT_DS,
        DT_DS_MS,
        DT_CHK_HH,
        DT_UPDATE,
        DT_DS_CHECK_THUNG,
        NTP_KH,
        NTP_LIST,
        NTP_CHK_VT,
        NTP_DS,
        NTP_CHK_THUNG,
        OBA_KH,
        NTP_UPDATE,
        OBA_PXK,
        OBA_HH,
        OBA_DS,
        OBA_UPDATE,
        NTP_HH,
        XTC_KH,
        XTC_HH,
        XTC_PL,
        XTC_CHK_THUNG,
        XTC_DS,
        OBA_CHK_THUNG,
        OBA_NTP_CHK_THUNG,
        XTC_UPDATE,
        XCK_CHK_THUNG,
        XTP_UPDATE,
        NCK_DS,
        NCK_CHK_THUNG,
        NTPCK_UPDATE,
        XTP_DS,
        XTP_DESTINATION,
        XTP_PL,
        XTP_CHK_THUNG,
        XCK_UPDATE,
        NCK_NL_UPDATE
    }

    public enum GoodsIssueCategory
    {
        ProduceAndOther = 2,
        Manufacture = 9,
        SwitchWarehouse = 8
    }
    public enum Menu
    {
        MyEcomaint,
        DiChuyenTB,
        NghiemThuPBT,
        KiemKeTB,
        History,
        TheoDoiYCBT,
        Dashboard
    }
    public enum UserType
    {
        CONGNHAN = 1,
        NHANVIEN = 2,
        QUANLY = 3
    }
    public enum PackingCategory
    {
        XemPackingList = 0,
        DongThungSanXuat = 1,
        DongThungSauKiemOBA = 2,
        DongThungSauTaiChe = 3
    }

    public enum DXCategory
    {
        KiemTraViTri = 3,
        XuatChuyenKhoTP = 8,
        XuatThanhPhamKiemOBA = 14,
    }

    public enum DNCategory
    {
        NhapNPL = 1,
        NhapTPChuyenKho = 12,
        NhapTPSauKiemOBA = 14,
        NhapTPSauTaiChe = 17
    }

    public enum CookieKey
    {
        IsRememberMe,
        UserName,
        Module,
        Database,
        Token
    }
}
