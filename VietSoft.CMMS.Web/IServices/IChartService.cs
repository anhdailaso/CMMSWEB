using Microsoft.AspNetCore.Mvc.Rendering;
using VietSoft.CMMS.Core.Models;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.Models;

namespace VietSoft.CMMS.Web.IServices
{
    public interface IChartService
    {
        IEnumerable<GetSituationWOObj> GetSituationWO();
        IEnumerable<GetDeviceInfoObj> GetDeviceInfo(string Username);
        IEnumerable<GetDeviceStatusObj> GetDeviceStatus(string Username);
        IEnumerable<GetSituationWOColumnObj> GetSituationWOColumn(string Username);
        IEnumerable<GetDowtimeCauseObj> GetDowtimeCause(string Username);
        int GetSoMay();
    }
}
