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
using System.Globalization;
using Newtonsoft.Json;
using System.IO;
using System.Reflection;

namespace VietSoft.HRM.Web.Controllers
{
    public class HomeController : BaseController
    {
        private readonly IHostEnvironment _hostEnvironment;
        private readonly ILogger<HomeController> _logger;
        private readonly IAccountService _accountService;
        private readonly IComboboxService _combobox;
        private readonly IHomeService _homeService;
        private readonly IMaintenanceService _maintenanceService;
        public HomeController(ILogger<HomeController> logger, IAccountService accountService, IHomeService homeService, IComboboxService combobox,
            IMaintenanceService maintenanceService, IHostEnvironment hostEnvironment)
        {
            _logger = logger;
            _accountService = accountService;
            _homeService = homeService;
            _combobox = combobox;
            _maintenanceService = maintenanceService;
            _hostEnvironment = hostEnvironment;
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
            ViewBag.ListLoaiMAY = _combobox.GetLoaiMayAll(SessionManager.CurrentUser.UserName, 0, 1);
            return View();
        }

        public ActionResult GoBack()
        {
            var refererUrl = Request.Headers["Referer"].ToString();

            if (!string.IsNullOrEmpty(refererUrl))
            {
                return Redirect(refererUrl);
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }
        }

        public IActionResult Moningtoring(string msmay, string tenmay, int flag)
        {
            res = null;
            ViewBag.MS_MAY = msmay;
            ViewBag.TEN_MAY = tenmay;
            ViewBag.FLAG = flag;
            //List<MonitoringParametersByDevice> model = _homeService.GetMonitoringParametersByDevice(SessionManager.CurrentUser.UserName,0,msmay,1,-1);
            return View("~/Views/Moningtoring/Index.cshtml");
        }
        public IActionResult UserRequest(string msmay, string tenmay, int flag)
        {
            res = null;
            ViewBag.MS_MAY = msmay;
            ViewBag.TEN_MAY = tenmay;
            ViewBag.FLAG = flag;
            UserRequestViewModel userequest = new UserRequestViewModel();
            try
            {
                if (flag == 1)
                {
                    userequest = _homeService.GetUserRequest(msmay, SessionManager.CurrentUser.UserName);
                    if (userequest != null && !string.IsNullOrEmpty(userequest.Files))
                    {
                        var files = Newtonsoft.Json.JsonConvert.DeserializeObject<List<ImageFiles>>(userequest.Files);
                        var lst = files != null ? files.Select(x => x.DUONG_DAN).ToList() : new List<string>();
                        var lstBase64 = new List<string>();
                        foreach (var item in lst)
                        {
                            lstBase64.Add(item.ToBase64StringImage());
                        }
                        ViewBag.DanhSachHinhAnh = lstBase64;
                    }
                }
                else
                {
                    userequest.STT = -1;
                    userequest.USERNAME = SessionManager.CurrentUser.UserName;
                }
            }
            catch
            {
            }
            ViewBag.NguyenNhan = _combobox.DanhSachNguyenNhan();
            ViewBag.UuTien = _combobox.LoadListUuTien(0);
            return View("~/Views/UserRequest/Index.cshtml", userequest);
        }
        public IActionResult WorkOrder(string msmay, string tenmay, int flag, string ttmay)
        {
            res = null;
            ViewBag.MS_MAY = msmay;
            ViewBag.TEN_MAY = tenmay;
            ViewBag.FLAG = flag;

            var ticketMaintenance = _maintenanceService.GetTicketMaintenanceByDevice(SessionManager.CurrentUser.UserName, msmay, flag == 1 ? false : true);
            if (flag != 1)
            {
                ticketMaintenance.TINH_TRANG_MAY = ttmay;
            }
            ViewBag.LoaiBaoTri = _combobox.GetMaintenanceCategoy();
            ViewBag.UuTien = _combobox.GetPriorityCategory(0);
            return View("~/Views/WorkOrder/Index.cshtml", ticketMaintenance);
        }

        public IActionResult WorkOrderRQ(string mspbt, string msmay, string tenmay)
        {
            ViewBag.MS_MAY = msmay;
            ViewBag.TEN_MAY = tenmay;
            ViewBag.FLAG = 2;
            var ticketMaintenance = _maintenanceService.GetTicketMaintenanceByDevice(mspbt);
            ViewBag.LoaiBaoTri = _combobox.GetMaintenanceCategoy();
            ViewBag.UuTien = _combobox.GetPriorityCategory(0);
            return View("~/Views/WorkOrder/Index.cshtml", ticketMaintenance);
        }
        public ActionResult getDevices(string WorkSiteID, int coall)
        {
            SelectList lst = _combobox.GetCbbMay(WorkSiteID, -1, SessionManager.CurrentUser.UserName, 0, coall);
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
        public IActionResult GetMyEcomain(string keyword, int pageIndex, int pageSize, string msnx, string mslmay, string denngay, bool xuly)
        {
            PagedList<MyEcomaintViewModel>? result = null;
            if (pageIndex == 1 && keyword == null)
            {
                var user = SessionManager.CurrentUser.UserName;
                DateTime? endDate = DateTime.ParseExact(denngay, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                res = _homeService.GetMyEcomain(user, 0, endDate, msnx, mslmay, xuly, pageIndex, pageSize);
                result = new PagedList<MyEcomaintViewModel>(res, res.Count, pageIndex, pageSize);
            }
            else
            {
                if (keyword != null)
                {
                    result = new PagedList<MyEcomaintViewModel>(res.Where(x => x.MS_MAY.ToLower().Contains(keyword.ToLower())).ToList(), res.Count(x => x.MS_MAY.ToLower().Contains(keyword.ToLower())), pageIndex, pageSize);
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
                        item.DUONG_DAN = modelItem.DUONG_DAN;
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
        public async Task<ActionResult> SaveImage(IFormFile image, string dev)
        {
            try
            {
                string uploadedFiles = await SaveUploadFile(image, dev);
                return Json(new JsonResponseViewModel { Data = new Imagemodel { Path = uploadedFiles, Path64 = uploadedFiles.ToBase64StringImage() }, ResponseCode = 1, ResponseMessage = Message.CAPNHAT_THANHCONG });
            }
            catch (Exception ex)
            {
                return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = Message.COLOI_XAYRA });
            }
        }
        public ActionResult OpenFile(string filePath)
        {
            //filePath = @"\\192.168.1.6\TaiLieu\Tai_Lieu_May\GSTT\GSTT_10.docx";
            byte[] fileBytes = System.IO.File.ReadAllBytes(filePath);
            string fileName = Path.GetFileName(filePath);
            return File(fileBytes, System.Net.Mime.MediaTypeNames.Application.Octet, fileName);
        }

        [HttpPost]
        public async Task<ActionResult> SaveMonitoring(string jsonData)
        {
            //List<MonitoringParametersByDevice> lstParameter = Newtonsoft.Json.JsonConvert.DeserializeObject<List<MonitoringParametersByDevice>>(jsonData);
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
        public async Task<ActionResult> SaveUserRequest(IList<IFormFile> files, string data)
        {
            UserRequestViewModel? model = string.IsNullOrEmpty(data) ? new UserRequestViewModel() : Newtonsoft.Json.JsonConvert.DeserializeObject<UserRequestViewModel>(data);
            if (model != null)
            {
                var uploadedFiles = await SaveUploadFile(files, model.MS_MAY);

                model.NGUOI_YEU_CAU = SessionManager.ThongTinChung.HO_TEN;
                if (model.HONG == true)
                {
                    model.NGAY_XAY_RA = DateTime.ParseExact(model.NGAY_XAY_RA_STR, Setting.FORMAT_DATE, null);
                }
                else
                {
                    model.NGAY_XAY_RA = null;
                }
                model.ListImage = new List<ImageFiles>();
                foreach (var item in uploadedFiles)
                {
                    ImageFiles iamge = new ImageFiles();
                    iamge.DUONG_DAN = item;
                    model.ListImage.Add(iamge);
                }
                model.Files = JsonConvert.SerializeObject(model.ListImage).ToString();
                BaseResponseModel? res = _homeService.SaveUserRequest(SessionManager.CurrentUser.UserName, model);
                if (res.MA == 1)
                {
                    return Json(new JsonResponseViewModel { ResponseCode = 1, ResponseMessage = Message.CAPNHAT_THANHCONG });
                }
                else
                {
                    return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = Message.COLOI_XAYRA });
                }
            }
            return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = Message.COLOI_XAYRA });
        }

        [HttpPost]
        public async Task<ActionResult> DeleteUserRequest(int stt)
        {
            BaseResponseModel? res = _homeService.DeleteUserRequest(stt);
            if (res.MA == 1)
            {
                return Json(new JsonResponseViewModel { ResponseCode = 1, ResponseMessage = Message.CAPNHAT_THANHCONG });
            }
            else
            {
                return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = Message.COLOI_XAYRA });
            }
        }

        public ActionResult ShowConfirmModal(string message)
        {
            ViewBag.Message = message;
            return PartialView("~/Views/Shared/_ConfirmModal.cshtml");
        }

        [HttpPost]
        public ActionResult ViewImageModal(string image)
        {
            ViewBag.Image = image;
            return PartialView("~/Views/Home/_viewImageModal.cshtml");
        }
        public string LayDuoiFile(string strFile)
        {
            string[] FILE_NAMEArr, arr;
            string FILE_NAME = "";
            string str = "";
            FILE_NAMEArr = strFile.Split(@"\");
            FILE_NAME = FILE_NAMEArr[FILE_NAMEArr.Length - 1];
            arr = FILE_NAME.Split(".");
            return "." + arr[arr.Length - 1];
        }
        public async Task<string> SaveUploadFile(IFormFile dataSource, string msmay)
        {
            try
            {
                int stt = 1;

                //\\192.168.1.6\TaiLieu\Hinh_May\AIC-0002\15_3_2023\GSTT_AIC-0002_20230315_9.png
                string rootPath = SessionManager.ThongTinChung.DUONG_DAN_TL + "\\" + "Hinh_May" + "\\" + msmay + "\\" + DateTime.Now.Day + "_" + DateTime.Now.Month + "_" + DateTime.Now.Year;
                try
                {
                    string[] files = Directory.GetFiles(rootPath).Where(x => x.Contains("GSTT")).ToArray();
                    stt = files.Length + 1;
                }
                catch
                {
                    stt = 1;
                }
                string fullFilePath = SessionManager.ThongTinChung.DUONG_DAN_TL + "\\" + "Hinh_May" + "\\" + msmay + "\\" + DateTime.Now.Day + "_" + DateTime.Now.Month + "_" + DateTime.Now.Year + "\\" + "GSTT" + "_" + msmay + "_" + DateTime.Now.Day.ToString() + DateTime.Now.Month.ToString() + DateTime.Now.Year.ToString() + "_" + stt.ToString() + LayDuoiFile(dataSource.FileName);
                bool exists = System.IO.Directory.Exists(rootPath);
                if (!exists)
                    System.IO.Directory.CreateDirectory(rootPath);
                var extension = Path.GetExtension(rootPath + dataSource.FileName);
                if (System.IO.File.Exists(fullFilePath)) return fullFilePath;
                using (var stream = System.IO.File.Create(fullFilePath))
                {
                    await dataSource.CopyToAsync(stream);
                }
                return fullFilePath;
            }
            catch
            {
                return "";
            }
        }
        public async Task<List<string>> SaveUploadFile(IList<IFormFile> files, string msmay)
        {
            var uploadedFiles = new List<string>();
            int stt = 1;
            foreach (var dataSource in files)
            {
                string fullFilePath = SessionManager.ThongTinChung.DUONG_DAN_TL + "\\" + "Hinh_May" + "\\" + msmay + "\\" + DateTime.Now.Day + "_" + DateTime.Now.Month + "_" + DateTime.Now.Year + "\\" + "YCNSD" + "_" + msmay + "_" + DateTime.Now.Day.ToString() + DateTime.Now.Month.ToString() + DateTime.Now.Year.ToString() + "_" + stt.ToString() + LayDuoiFile(dataSource.FileName);
                stt++;
                var fileName = "\\" + "YCNSD" + "_" + msmay + "_" + DateTime.Now.Day.ToString() + DateTime.Now.Month.ToString() + DateTime.Now.Year.ToString() + "_" + stt.ToString() + LayDuoiFile(dataSource.FileName);
                string rootPath = SessionManager.ThongTinChung.DUONG_DAN_TL + "\\" + "Hinh_May" + "\\" + msmay + "\\" + DateTime.Now.Day + "_" + DateTime.Now.Month + "_" + DateTime.Now.Year;

                bool exists = System.IO.Directory.Exists(rootPath);

                if (!exists)
                    System.IO.Directory.CreateDirectory(rootPath);
                var extension = Path.GetExtension(rootPath + fileName);
                if (System.IO.File.Exists(fullFilePath)) continue;
                using (var stream = System.IO.File.Create(fullFilePath))
                {
                    await dataSource.CopyToAsync(stream);
                    uploadedFiles.Add(fullFilePath);
                }
            }
            return uploadedFiles;
        }
    }
}