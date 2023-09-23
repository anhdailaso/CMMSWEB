using Microsoft.AspNetCore.Mvc.Rendering;
using VietSoft.CMMS.Core.Models;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.Models;
using VietSoft.CMMS.Web.Models.Maintenance;

namespace VietSoft.CMMS.Web.IServices
{
    public interface IHomeService
    {
        List<MyEcomaintViewModel> GetMyEcomain(string username, int languages, DateTime? dngay, string ms_nx, string mslmay, bool xuly,bool locNV, int pageIndex, int pageSize);
        MorningToringViewModel GetMorningToring(string msgstt, string userName, string deviceId, bool flag);
        List<MonitoringParametersByDevice> GetMonitoringParametersByDevice(string username, int languages,string may,int isDue,int stt);
        List<string> GetMenu(string username);
        int QuyenMenuGSTT(string username);
        string GetSoPhieuYeu(string ms);
        int UpdateAvatar(string username, IFormFile image);
        BaseResponseModel SaveMonitoring(MorningToringViewModel model, string msmay, string username, string jsonData);
        BaseResponseModel DeleteUserRequest(int stt);
        UserRequestViewModel GetUserRequest(string msyc,string msmay, string username, int them);
        BaseResponseModel SaveUserRequest(string username,UserRequestViewModel request);

        BaseResponseModel SaveAcceptUserRequest(string username, AcceptUserRequest model);
        IEnumerable<NguoiThucHienModel> GetNguoiThucHienGS(string userName, string deviceId, int stt, int languages);
        ResponseViewModel SaveNguoiThucHienGS(int stt, string json);
        ResponseViewModel Completed(int stt,string Completed);
        ResponseViewModel DeleteGSTT(int stt);

    }
}
