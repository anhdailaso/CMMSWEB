using Microsoft.AspNetCore.Mvc.Rendering;
using VietSoft.CMMS.Web.Models;

namespace VietSoft.CMMS.Web.IServices
{
    public interface IAccountService
    {
        public int Login(string userName, string passWord);
        UserModel GetProfile(string userName);
        ThongTinChungViewModel GetThongTinChung(string userName);
        List<SelectListItem> GetDatabaseList();
    }
}
