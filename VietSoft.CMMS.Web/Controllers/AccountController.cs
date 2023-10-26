using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.Models;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Resources;
using Microsoft.AspNetCore.Mvc.Rendering;

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
        public IActionResult Login(string returnUrl = null)
        {
            MessageUtil.ClearMessage();
            string? dbEncrypt = Request.Cookies[CookieKey.Database.ToString()];
            string database = string.IsNullOrEmpty(dbEncrypt) ? _config["ConnectionStrings:DatabaseDefault"] : MaHoamd5.MaHoamd5.Decrypt(dbEncrypt, true);

            string? isRememberMeEncrypt = Request.Cookies[CookieKey.IsRememberMe.ToString()];
            bool isRememberMeCookie = !string.IsNullOrEmpty(isRememberMeEncrypt) && Convert.ToBoolean(MaHoamd5.MaHoamd5.Decrypt(isRememberMeEncrypt, true));
            if (isRememberMeCookie)
            {
                string? userNameEncrypt = Request.Cookies[CookieKey.UserName.ToString()];
                string? userName = MaHoamd5.MaHoamd5.Decrypt(userNameEncrypt, true);
                //string? TypeLangue = Request.Cookies[CookieKey.TypeLangue.ToString()];
                // init session
                UserModel? user = _accountService.GetProfile(userName);
                user.TypeLangue = 0;
                SessionManager.CurrentUser = user;
                SessionManager.ThongTinChung = _accountService.GetThongTinChung(userName);
                if (string.IsNullOrEmpty(returnUrl))
                {
                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    return Redirect(returnUrl.Replace('*','&'));
                }
            }

            List<SelectListItem>? databases = _accountService.GetDatabaseList();
            ViewBag.Databases = new SelectList(databases, "Value", "Text");

            LoginViewModel? model = new()
            {
                RememberMe = isRememberMeCookie,
                ReturnUrl = returnUrl,
                Database = database
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
                int res = _accountService.Login(userViewModel.UserName, userViewModel.Password);
                if (res == 1)
                {
                    user = _accountService.GetProfile(userViewModel.UserName);
                    user.RememberMe = userViewModel.RememberMe;
                    user.TypeLangue = 0;
                    SessionManager.CurrentUser = user;
                    SessionManager.ThongTinChung = _accountService.GetThongTinChung(userViewModel.UserName);
                    // save cookie
                    CookieOptions cookieOptions = new()
                    {
                        Expires = DateTime.Now.AddDays(Convert.ToDouble(_config["CookieTimeout"])),
                        HttpOnly = true,
                        IsEssential = true
                    };


                    string? dbEncrypt = MaHoamd5.MaHoamd5.Encrypt(userViewModel.Database, true);
                    Response.Cookies.Append(CookieKey.Database.ToString(), dbEncrypt, cookieOptions);


                    // save cookie remember me
                    if (userViewModel.RememberMe)
                    {
                        string? rememberMeEncrypt = MaHoamd5.MaHoamd5.Encrypt(userViewModel.RememberMe.ToString(), true);
                        string? userNameEncrypt = MaHoamd5.MaHoamd5.Encrypt(userViewModel.UserName, true);

                        Response.Cookies.Append(CookieKey.IsRememberMe.ToString(), rememberMeEncrypt, cookieOptions);
                        Response.Cookies.Append(CookieKey.UserName.ToString(), userNameEncrypt, cookieOptions);
                        Response.Cookies.Append(CookieKey.TypeLangue.ToString(), "0", cookieOptions);
                    }
                }
                else
                {
                    MessageUtil.ShowError(Message.LOGIN_FAILED, false);

                    List<SelectListItem>? databases = _accountService.GetDatabaseList();
                    ViewBag.Databases = new SelectList(databases, "Value", "Text");


                    return View(userViewModel);
                }
                if(userViewModel.ReturnUrl == null)
                {
                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    return Redirect(userViewModel.ReturnUrl.Replace('*', '&'));
                }    
                //return RedirectToAction("HistoryIndex", "History");
            }
            return View(userViewModel);
        }

        [HttpPost]
        public IActionResult ChangeDatabase(string db)
        {
            // change connection string
            string connString = MaHoamd5.MaHoamd5.Decrypt(_config["ConnectionStrings:CMMSConnection"], true);
            SessionManager.ConnectionString = string.Format(connString, db);

            return Json(new { Message = "Success" });
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
