using System.ComponentModel.DataAnnotations;
using VietSoft.CMMS.Web.Resources;

namespace VietSoft.CMMS.Web.Models
{
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
        public List<MonitoringParametersByDevice> MonitoringParameters { get;set; }

    }
    public class Imagemodel
    {
        public string Path { get; set; }
        public string Path64 { get; set; }
    }
}
