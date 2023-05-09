using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.Models;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Resources;
namespace VietSoft.CMMS.Web.Controllers
{
    public class AccountController : Controller
    {
        private readonly IConfiguration _config;
        private readonly ILogger<AccountController> _logger;
        private readonly IAccountService _accountService;
        public AccountController(IAccountService accountService, ILogger<AccountController> logger, IConfiguration config)
        {
            _accountService = accountService;
            _logger = logger;
            _config = config;
        }
        public IActionResult Login()
        {
            MessageUtil.ClearMessage();
            string? isRememberMeEncrypt = Request.Cookies[CookieKey.IsRememberMe.ToString()];
            bool isRememberMeCookie = !string.IsNullOrEmpty(isRememberMeEncrypt) && Convert.ToBoolean(MaHoamd5.MaHoamd5.Decrypt(isRememberMeEncrypt, true));
            if (isRememberMeCookie)
            {
                string? userNameEncrypt = Request.Cookies[CookieKey.UserName.ToString()];
                string? userName = MaHoamd5.MaHoamd5.Decrypt(userNameEncrypt, true);
                //string? TypeLangue = Request.Cookies[CookieKey.TypeLangue.ToString()];

                // init session
                UserModel? user = _accountService.GetProfile(userName);
                user.TypeLangue = 1;
                SessionManager.CurrentUser = user;
                return RedirectToAction("Index", "Home");
            }

            LoginViewModel? model = new()
            {
                RememberMe = isRememberMeCookie,
            };

            return View(model);
        }

        public IActionResult ForgotPassword()
        {
            return View();
        }
        [HttpPost]
        public IActionResult Login(LoginViewModel userViewModel)
        {
            if (ModelState.IsValid)
            {
                UserModel? user = new();
                SessionManager.Module = userViewModel.Module;
                int res = _accountService.Login(userViewModel.UserName, userViewModel.Password);
                if (res == 1)
                {
                    user.UserName = userViewModel.UserName;
                    user.RememberMe = userViewModel.RememberMe;
                    user.TypeLangue = 1;
                    SessionManager.CurrentUser = user;

                    // save cookie
                    CookieOptions cookieOptions = new()
                    {
                        Expires = DateTime.Now.AddDays(Convert.ToDouble(_config["CookieTimeout"])),
                        HttpOnly = true,
                        IsEssential = true
                    };
                    // save cookie remember me
                    if (userViewModel.RememberMe)
                    {
                        string? rememberMeEncrypt = MaHoamd5.MaHoamd5.Encrypt(userViewModel.RememberMe.ToString(), true);
                        string? userNameEncrypt = MaHoamd5.MaHoamd5.Encrypt(userViewModel.UserName, true);

                        Response.Cookies.Append(CookieKey.IsRememberMe.ToString(), rememberMeEncrypt, cookieOptions);
                        Response.Cookies.Append(CookieKey.UserName.ToString(), userNameEncrypt, cookieOptions);
                        Response.Cookies.Append(CookieKey.TypeLangue.ToString(), "1", cookieOptions);
                    }
                }
                else
                {
                    MessageUtil.ShowError(Message.LOGIN_FAILED, false);
                    return View(userViewModel);
                }
                return RedirectToAction("Index", "Home");
                //return RedirectToAction("HistoryIndex", "History");
            }
            return View(userViewModel);
        }

        public IActionResult ChangePassword()
        {
            return View();
        }

        public IActionResult LogOut()
        {
            HttpContext.SignOutAsync();
             HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            HttpContext.Session.Clear();
            foreach (KeyValuePair<string, string> cookie in Request.Cookies)
            {
                if (cookie.Key != CookieKey.Module.ToString() && cookie.Key != CookieKey.Database.ToString())
                    Response.Cookies.Delete(cookie.Key);
            }
            return RedirectToAction("Login");
        }
    }
}
