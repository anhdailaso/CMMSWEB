using VietSoft.CMMS.Web.Extensions;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.Models;
using VietSoft.CMMS.Web.Extensions;
using VietSoft.CMMS.Web.Models;

namespace VietSoft.CMMS.Web.Helpers
{
    public static class SessionManager
    {
        private static IHttpContextAccessor _httpContextAccessor;

        public static void Configure(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public static UserModel CurrentUser
        {
            get
            {
                if (_httpContextAccessor.HttpContext.Session.Get<UserModel>("CurrentUser") == null)
                {
                    return new UserModel();
                }
                return _httpContextAccessor.HttpContext.Session.Get<UserModel>("CurrentUser");
            }
            set => _httpContextAccessor.HttpContext.Session.Set<UserModel>("CurrentUser", value);
        }



     

        public static ModuleType Module
        {
            get
            {
                if (_httpContextAccessor.HttpContext.Session.Get<ModuleType>("Module") == null)
                {
                    return ModuleType.WAREHOUSE;
                }
                return _httpContextAccessor.HttpContext.Session.Get<ModuleType>("Module");
            }
            set => _httpContextAccessor.HttpContext.Session.Set<ModuleType>("Module", value);
        }

        



        public static List<MenuViewModel> Menus
        {
            get
            {
                if (_httpContextAccessor.HttpContext.Session.Get<List<MenuViewModel>>("Menus") == null)
                {
                    return new List<MenuViewModel>();
                }
                return _httpContextAccessor.HttpContext.Session.Get<List<MenuViewModel>>("Menus");
            }
            set => _httpContextAccessor.HttpContext.Session.Set<List<MenuViewModel>>("Menus", value);
        }

        public static MessageViewModel? Message
        {
            get
            {
                if (_httpContextAccessor.HttpContext.Session.Get<MessageViewModel>("Message") == null)
                {
                    return null;
                }
                return _httpContextAccessor.HttpContext.Session.Get<MessageViewModel>("Message");
            }
            set => _httpContextAccessor.HttpContext.Session.Set<MessageViewModel>("Message", value);
        }

        public static ThongTinChungViewModel? ThongTinChung
        {
            get
            {
                if (_httpContextAccessor.HttpContext.Session.Get<ThongTinChungViewModel>("DIA_CHI") == null)
                {
                    return null;
                }
                return _httpContextAccessor.HttpContext.Session.Get<ThongTinChungViewModel>("DIA_CHI");
            }
            set => _httpContextAccessor.HttpContext.Session.Set<ThongTinChungViewModel>("DIA_CHI", value);
        }

        public static string ConnectionString
        {
            get
            {
                if (_httpContextAccessor.HttpContext.Session.Get<string>("ConnectionString") == null)
                {
                    return string.Empty;
                }
                return _httpContextAccessor.HttpContext.Session.Get<string>("ConnectionString");
            }
            set => _httpContextAccessor.HttpContext.Session.Set<string>("ConnectionString", value);
        }
    }
}
