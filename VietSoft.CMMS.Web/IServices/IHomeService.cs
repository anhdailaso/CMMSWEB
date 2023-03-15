using Microsoft.AspNetCore.Mvc.Rendering;
using VietSoft.CMMS.Core.Models;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.Models;

namespace VietSoft.CMMS.Web.IServices
{
    public interface IHomeService
    {
        List<MyEcomaintViewModel> GetMyEcomain(string username, int languages, DateTime? dngay, string ms_nx, string mslmay, bool xuly, int pageIndex, int pageSize);
        List<MonitoringParametersByDevice> GetMonitoringParametersByDevice(string username, int languages,string may,int isDue,int stt);
        BaseResponseModel SaveMonitoring(string username,string jsonData);
        UserRequestViewModel GetUserRequest(string msmay);
        BaseResponseModel SaveUserRequest(string username,UserRequestViewModel request);

    }
}
