using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using VietSoft.CMMS.Web.Models;
using VietSoft.CMMS.Web.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using VietSoft.CMMS.Web.Resources;
using VietSoft.CMMS.Web.Controllers;
using VietSoft.CMMS.Web.IServices;
using System.Data;
using VietSoft.CMMS.Core.Models;

namespace VietSoft.HRM.Web.Controllers
{
    public class HomeController : BaseController
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IAccountService _accountService;
        private readonly IComboboxService _combobox;
        private readonly IHomeService _homeService;
        private readonly IMaintenanceService _maintenanceService;

        public HomeController(ILogger<HomeController> logger, IAccountService accountService, IHomeService homeService, IComboboxService combobox,
            IMaintenanceService maintenanceService)
        {
            _logger = logger;
            _accountService = accountService;
            _homeService = homeService;
            _combobox = combobox;
            _maintenanceService = maintenanceService;
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
            SessionManager.ThongTinChung = _accountService.GetThongTinChung(SessionManager.CurrentUser.UserName);
            ViewBag.ListNhaXuong = _combobox.GetCbbDiaDiem(SessionManager.CurrentUser.UserName, 0, 1);
            ViewBag.ListMAY = _combobox.GetCbbMay("-1", -1, SessionManager.CurrentUser.UserName, 0, 1);
            return View();
        }

        public IActionResult Moningtoring(string msmay, string tenmay, int flag)
        {
            ViewBag.MS_MAY = msmay;
            ViewBag.TEN_MAY = tenmay;
            ViewBag.FLAG = flag;
            //List<MonitoringParametersByDevice> model = _homeService.GetMonitoringParametersByDevice(SessionManager.CurrentUser.UserName,0,msmay,1,-1);
            return View("~/Views/Moningtoring/Index.cshtml");
        }
        public IActionResult UserRequest(string msmay, string tenmay, int flag)
        {
            ViewBag.MS_MAY = msmay;
            ViewBag.TEN_MAY = tenmay;
            ViewBag.FLAG = flag;
            UserRequestViewModel userequest = new UserRequestViewModel();
            if (flag == 1)
            {
                userequest = _homeService.GetUserRequest(msmay);
            }
            ViewBag.NguyenNhan = _combobox.DanhSachNguyenNhan();
            ViewBag.UuTien = _combobox.LoadListUuTien(0);
            return View("~/Views/UserRequest/Index.cshtml", userequest);
        }
        public IActionResult WorkOrder(string msmay, string tenmay, int flag)
        {
            ViewBag.MS_MAY = msmay;
            ViewBag.TEN_MAY = tenmay;
            ViewBag.FLAG = flag;
            //nếu flag = 1 thì lấy

            var ticketMaintenance = _maintenanceService.GetTicketMaintenanceByDevice(SessionManager.CurrentUser.UserName, msmay, flag == 1 ? false : true);
            ViewBag.LoaiBaoTri = _combobox.GetMaintenanceCategoy();
            ViewBag.UuTien = _combobox.GetPriorityCategory(0);
            return View("~/Views/WorkOrder/Index.cshtml", ticketMaintenance);
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
                        MenuUrl = "/MoveDevice/Index",
                    };
                case Menu.NghiemThuPBT:
                    return new MenuViewModel
                    {
                        MenuId = (int)Menu.NghiemThuPBT,
                        MenuName = "Nghiệm thu phiếu bảo trì",
                        MenuIcon = "nghiemthu.png",
                        MenuUrl = "/AcceptMaintenance/Index",
                    };
                case Menu.KiemKeTB:
                    return new MenuViewModel
                    {
                        MenuId = (int)Menu.KiemKeTB,
                        MenuName = "Kiểm kê thiết bị",
                        MenuIcon = "kiemke.png",
                        MenuUrl = "/InventoryDevice/Index",
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
                        MenuUrl = "/Dashboard/Index",
                    };

                default:
                    return new MenuViewModel();
            }
        }
        public static List<MyEcomaintViewModel>? res;
        public IActionResult GetMyEcomain(string keyword, int pageIndex, int pageSize, string msnx, string msmay, string denngay, bool xuly)
        {
            PagedList<MyEcomaintViewModel>? result = null;
            if (pageIndex == 1 && keyword == null)
            {
                var user = SessionManager.CurrentUser.UserName;
                DateTime? endDate = ExtendedDateTime.ToDateTimeOrDefault(denngay);
                res = _homeService.GetMyEcomain(user, 0, endDate, msnx, msmay, xuly, pageIndex, pageSize);
                result = new PagedList<MyEcomaintViewModel>(res, res.Count, pageIndex, pageSize);
            }
            else
            {
                if (keyword != null)
                {
                    result = new PagedList<MyEcomaintViewModel>(res.Where(x => x.MS_MAY.Contains(keyword)).ToList(), res.Count(x => x.MS_MAY.Contains(keyword)), pageIndex, pageSize);
                }
                else
                {
                    result = new PagedList<MyEcomaintViewModel>(res, res.Count, pageIndex, pageSize);
                }
            }
            return PartialView("_homedetail", result);
        }

        public IActionResult GetMonitoringParametersByDevice(string msmay, int isDue)
        {
            List<MonitoringParametersByDevice> model = _homeService.GetMonitoringParametersByDevice(SessionManager.CurrentUser.UserName, 0, msmay, isDue, -1);
            List<MonitoringViewModel> resulst = new List<MonitoringViewModel>();
            try
            {


                foreach (var modelItem in model)
                {
                    //kiểm tra có trong resulst không
                    if (resulst.Count(x => x.ComponentID.Equals(modelItem.ComponentID) && x.MonitoringParamsID.Equals(modelItem.MonitoringParamsID)) == 0)
                    {
                        MonitoringViewModel item = new MonitoringViewModel();
                        item.DeviceID = modelItem.DeviceID;
                        item.MonitoringParamsName = modelItem.MonitoringParamsName;
                        item.MonitoringParamsID = modelItem.MonitoringParamsID;
                        item.ComponentID = modelItem.ComponentID;
                        item.ComponentName = modelItem.ComponentName;
                        item.MeasurementUnitName = modelItem.MeasurementUnitName;
                        item.TypeOfParam = modelItem.TypeOfParam;
                        item.ImageGS = modelItem.ImageGS;
                        item.MonitoringParameters = model.Where(x1 => x1.ComponentID.Equals(modelItem.ComponentID) && x1.MonitoringParamsID.Equals(modelItem.MonitoringParamsID)).ToList();
                        resulst.Add(item);
                    }
                }
            }
            catch (Exception ex)
            {
                model = null;
            }

            return PartialView("~/Views/Moningtoring/_moningtoringdetail.cshtml", resulst);

        }
        [HttpPost]
        public ActionResult SaveMonitoring(string jsonData)
        {
            //List<MonitoringParametersByDevice> lstParameter = Newtonsoft.Json.JsonConvert.DeserializeObject<List<MonitoringParametersByDevice>>(data);
            BaseResponseModel? res = _homeService.SaveMonitoring(SessionManager.CurrentUser.UserName, jsonData);
            if (res.MA == 1)
            {
                return Json(new JsonResponseViewModel { ResponseCode = 1, ResponseMessage = Message.CAPNHAT_THANHCONG });
            }
            else
            {
                return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = Message.COLOI_XAYRA });
            }
        }

        [HttpPost]
        public ActionResult SaveUserRequest(UserRequestViewModel model)
        {
            model.NGUOI_YEU_CAU = SessionManager.CurrentUser.FullName;
            BaseResponseModel? res = _homeService.SaveUserRequest(SessionManager.CurrentUser.UserName, model);
            if  (res.MA == 1)
            {
                return Json(new JsonResponseViewModel { ResponseCode = 1, ResponseMessage = Message.CAPNHAT_THANHCONG });
            }
            else
            {
                return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = Message.COLOI_XAYRA });
            }

        }
    }
}