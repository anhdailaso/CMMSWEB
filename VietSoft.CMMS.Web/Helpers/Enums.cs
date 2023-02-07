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
        GET_WORDORDER,
        GET_WORDORDER_DETAILS,
        GET_LIST_JOB,
        GET_LIST_SPAREPART,
        GET_LIST_WORKING_TIME,
        GET_LIST_FAILRULE_ANALYSIS,
        GET_LISTWO_FAILRULE_ANALYSIS,
        SAVE_LIST_SPAREPART,
        SAVE_LIST_JOB,
        SAVE_LIST_WORKING_TIME
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
        Typelanges,
        IsRememberMe,
        UserName,
        Module,
        Database,
        Token
    }
}
