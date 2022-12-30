using Microsoft.AspNetCore.Mvc.Rendering;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.Models;

namespace VietSoft.CMMS.Web.IServices
{
    public interface IHomeService
    {
        List<MyEcomaintViewModel> GetMyEcomain(string username, int languages, DateTime? dngay, string ms_nx, string may,bool xuly, int pageIndex, int pageSize);
    }
}
