﻿using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using VietSoft.CMMS.Web.Models;
using VietSoft.CMMS.Web.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using VietSoft.CMMS.Web.Resources;
using Newtonsoft.Json;
using VietSoft.CMMS.Web.Controllers;
using VietSoft.CMMS.Web.IServices;
using System.Globalization;
using System.Runtime.Intrinsics.X86;
using System.Data;
using System.Reflection;
using Microsoft.SqlServer.Server;

namespace VietSoft.HRM.Web.Controllers
{
    public class HomeController : BaseController
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IAccountService _accountService;
        private readonly IComboboxService _combobox;
        private readonly IHomeService _homeService;

        public HomeController(ILogger<HomeController> logger, IAccountService accountService, IHomeService homeService, IComboboxService combobox)
        {
            _logger = logger;
            _accountService = accountService;
            _homeService = homeService;
            _combobox = combobox;
        }

        [AllowAnonymous]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        public IActionResult Index()
        {
            GetListMenu(0);
            ViewBag.ListNhaXuong = _combobox.GetCbbDiaDiem(SessionManager.CurrentUser.UserName,0,1);
            ViewBag.ListMAY = _combobox.GetCbbMay("-1",-1, SessionManager.CurrentUser.UserName, 0,1);
            return View();
        }

        public IActionResult Moningtoring(string msmay,string tenmay)
        {
            ViewBag.MS_MAY = msmay;
            ViewBag.TEN_MAY = tenmay;
            return View("~/Views/Moningtoring/Index.cshtml");
        }
        public IActionResult UserRequest(string msmay, string tenmay)
        {
            ViewBag.MS_MAY = msmay;
            ViewBag.TEN_MAY = tenmay;
            ViewBag.NguyenNhan = _combobox.DanhSachNguyenNhan();
            ViewBag.UuTien = _combobox.LoadListUuTien(0);
            return View("~/Views/UserRequest/Index.cshtml");
        }
        public IActionResult WorkOrder(string msmay, string tenmay)
        {
            ViewBag.MS_MAY = msmay;
            ViewBag.TEN_MAY = tenmay;
            ViewBag.LoaiBaoTri = _combobox.DanhSachLoaiBT();
            ViewBag.UuTien = _combobox.LoadListUuTien(0);
            return View("~/Views/WorkOrder/Index.cshtml");
        }
        public ActionResult getDevices(string WorkSiteID)
        {
            SelectList lst = _combobox.GetCbbMay(WorkSiteID, -1, SessionManager.CurrentUser.UserName, 0, 1);
            return Json(lst);
        }
        private static void GetListMenu(int menuSelected)
        {
            List<MenuViewModel> menus = new();
            menus.Add(GetMenuItem(Menu.MyEcomaint));
            menus.Add(GetMenuItem(Menu.DiChuyenTB));
            menus.Add(GetMenuItem(Menu.NghiemThuPBT));
            menus.Add(GetMenuItem(Menu.KiemKeTB));
            menus.Add(GetMenuItem(Menu.History));
            menus.Add(GetMenuItem(Menu.TheoDoiYCBT));
            menus.Add(GetMenuItem(Menu.Dashboard));
            SessionManager.Menus = menus;
        }
        private static MenuViewModel GetMenuItem(Menu menuItem)
        {
            switch (menuItem)
            {
                case Menu.MyEcomaint:
                    return new MenuViewModel
                    {
                        MenuId = (int)Menu.MyEcomaint,
                        MenuName = "My Ecomaint",
                        MenuIcon = "mytask.png",
                        MenuUrl = "/Home/Index",
                    };
                case Menu.DiChuyenTB:
                    return new MenuViewModel
                    {
                        MenuId = (int)Menu.DiChuyenTB,
                        MenuName = "Di chuyển thiết bị",
                        MenuIcon = "dichuyen.png",
                        MenuUrl = "/Home/Index",
                    };
                case Menu.NghiemThuPBT:
                    return new MenuViewModel
                    {
                        MenuId = (int)Menu.NghiemThuPBT,
                        MenuName = "Nghiệm thu phiếu bảo trì",
                        MenuIcon = "nghiemthu.png",
                        MenuUrl = "/Home/Index",
                    };
                case Menu.KiemKeTB:
                    return new MenuViewModel
                    {
                        MenuId = (int)Menu.KiemKeTB,
                        MenuName = "Kiểm kê thiết bị",
                        MenuIcon = "kiemke.png",
                        MenuUrl = "/Home/Index",
                    };
                case Menu.History:
                    return new MenuViewModel
                    {
                        MenuId = (int)Menu.History,
                        //MenuName = ViewText.TITLE_DANGKY_NGHI,
                        MenuName = "Lịch sử bảo trì thiết bị",
                        MenuIcon = "lichsu.png",
                        MenuUrl = "/History/HistoryIndex",
                    };
                case Menu.TheoDoiYCBT:
                    return new MenuViewModel
                    {
                        MenuId = (int)Menu.TheoDoiYCBT,
                        //MenuName = ViewText.TITLE_DANGKY_NGHI,
                        MenuName = "Theo dõi yêu cầu bảo trì",
                        MenuIcon = "Theodoi.png",
                        MenuUrl = "/HistoryRequest/HistoryRequestIndex",
                    };
                case Menu.Dashboard:
                    return new MenuViewModel
                    {
                        MenuId = (int)Menu.Dashboard,
                        MenuName = "Dashboard",
                        MenuIcon = "daskbord.png",
                        MenuUrl = "/Payslips/PayslipProducts",
                    };
               
                default:
                    return new MenuViewModel();
            }    
        }
        public static List<MyEcomaintViewModel>? res;
        public IActionResult GetMyEcomain(string keyword, int pageIndex, int pageSize, string msnx, string msmay,string denngay,bool xuly)
        {
            PagedList<MyEcomaintViewModel>? result = null;
            if (pageIndex == 1 && keyword == null)
            {
                var user = SessionManager.CurrentUser.UserName;
                DateTime? endDate = ExtendedDateTime.ToDateTimeOrDefault(denngay);
                res = _homeService.GetMyEcomain(user, 0, endDate, msnx, msmay,xuly, pageIndex, pageSize);
               result = new PagedList<MyEcomaintViewModel>(res, res.Count, pageIndex, pageSize);
            }
            else
            {
                if (keyword != null)
                {
                    result = new PagedList<MyEcomaintViewModel>(res.Where( x => x.MS_MAY.Contains(keyword)).ToList(), res.Count(x => x.MS_MAY.Contains(keyword)), pageIndex, pageSize);
                }
                else
                {
                    result = new PagedList<MyEcomaintViewModel>(res, res.Count, pageIndex, pageSize);
                }    
            }    
            return PartialView("_homedetail", result);
        }
    }
}