using System.ComponentModel.DataAnnotations;
using VietSoft.CMMS.Web.Resources;

namespace VietSoft.CMMS.Web.Models
{
    public class MyEcomaintViewModel
    {
        public string MS_MAY { get; set; }
        public string TEN_MAY { get; set; }
        public int COGS { get; set; }
        public string sListYC { get; set; }
        public string sListBT { get; set; }
        public string sListGS { get; set; }
        public List<MyEcomaintYeuCauModel> ListYC { get; set; }
        public List<MyEcomaintBaoTriModel> ListBT { get; set; }
        public List<MyEcomaintGiamSatModel> ListGS { get; set; }
    }

    public class MyEcomaintYeuCauModel
    {
        public string MS_YEU_CAU { get; set; }

        public int TREYC { get; set; }
        public int MUC_YC { get; set; }
        public int DUYET_YC { get; set; }
    }
    public class MyEcomaintBaoTriModel
    {
        public string MS_PHIEU_BAO_TRI { get; set; }

        public int TREBT { get; set; }
        public int MUC_BT { get; set; }
        public int HH_BT { get; set; }
    }

    public class MyEcomaintGiamSatModel
    {
        public string SO_PHIEU { get; set; }
        public int TREGS { get; set; }
        public int MUC_GS { get; set; }
    }

}
