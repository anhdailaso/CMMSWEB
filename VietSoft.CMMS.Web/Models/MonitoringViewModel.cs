using System.ComponentModel.DataAnnotations;
using VietSoft.CMMS.Web.Resources;

namespace VietSoft.CMMS.Web.Models
{

    public class ThoiGianChayMayViewModel
    {
        public string MS_MAY { get; set; }
        public DateTime NGAY { get; set; }
        public string sNGAY { get; set; }
        public double CHI_SO_DONG_HO { get; set; }
        public string USERNAME { get; set; }
        public double SO_GIO_LUY_KE { get; set; }
        public int THEM { get; set; }
    }

    public class MonitoringParametersByDevice
    {
        public string DeviceID { get; set; }
        public string MonitoringParamsName { get; set; }
        public string MonitoringParamsID { get; set; }
        public string ComponentID { get; set; }
        public string ComponentName { get; set; }
        public string ValueParamName { get; set; }
        public string Note { get; set; }
        public string MeasurementUnitName { get; set; }
        public bool TypeOfParam { get; set; }
        public double? Measurement { get; set; }
        public int Pass { get; set; }
        public int ValueParamID { get; set; }
        public int ID { get; set; }
        public string Path { get; set; }
        public string DUONG_DAN { get; set; }
    }

    public class MonitoringViewModel
    {
        public string DeviceID { get; set; }
        public string MonitoringParamsName { get; set; }
        public string MonitoringParamsID { get; set; }
        public string ComponentID { get; set; }
        public string ComponentName { get; set; }
        public string MeasurementUnitName { get; set; }
        public bool TypeOfParam { get; set; }
        public string DUONG_DAN { get; set; }
        public string Path { get; set; }
        public string Path64 { get; set; }
        public List<MonitoringParametersByDevice> MonitoringParameters { get;set; }

    }
    public class Imagemodel
    {
        public string Path { get; set; }
        public string Path64 { get; set; }
    }
    //SELECT A.MS_MAY, B.TEN_MAY, C.MS_BO_PHAN, C.TEN_BO_PHAN, D.TEN_TS_GSTT, A.TEN_GIA_TRI
    public class ThongSoKhongDat
    {
        public string MS_MAY { get; set; }
        public string TEN_MAY { get; set; }
        public string MS_BO_PHAN { get; set; }
        public string TEN_BO_PHAN { get; set; }
        public string TEN_TS_GSTT { get; set; }
        public string TEN_GIA_TRI { get; set; }

    }





}
