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
using System.Drawing;
using Microsoft.AspNetCore.StaticFiles;
using System.Net.Mime;
using VietSoft.CMMS.Web.Models.Maintenance;

namespace VietSoft.HRM.Web.Controllers
{
    public class HomeController : BaseController
    {
        private readonly IHostEnvironment _hostEnvironment;
        private readonly ILogger<HomeController> _logger;
        private readonly IAccountService _accountService;
        private readonly IComboboxService _combobox;
        private IHomeService _homeService;
        private readonly IMaintenanceService _maintenanceService;
        private readonly IFtpService _ftpservice;
        public HomeController(ILogger<HomeController> logger, IAccountService accountService, IHomeService homeService, IComboboxService combobox,
            IMaintenanceService maintenanceService, IHostEnvironment hostEnvironment, IFtpService ftpservice)
        {
            _logger = logger;
            _accountService = accountService;
            _homeService = homeService;
            _combobox = combobox;
            _maintenanceService = maintenanceService;
            _hostEnvironment = hostEnvironment;
            _ftpservice = ftpservice;
        }

        [AllowAnonymous]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        public IActionResult Index()
        {
            var listmenu = _homeService.GetMenu(SessionManager.CurrentUser.UserName);
            GetListMenu(listmenu);
            //SessionManager.ThongTinChung = _accountService.GetThongTinChung(SessionManager.CurrentUser.UserName);
            //với data nặng thì cho theo nhà xưởng
            ViewBag.ListNhaXuong = _combobox.GetCbbDiaDiem(SessionManager.CurrentUser.UserName, SessionManager.CurrentUser.TypeLangue, 1);
            ViewBag.ListLoaiMAY = _combobox.GetLoaiMayAll(SessionManager.CurrentUser.UserName, SessionManager.CurrentUser.TypeLangue, 1);
            return View();
        }

        public IActionResult WorkOrderLink(string mspbt, string msmay)
        {

            var listmenu = _homeService.GetMenu(SessionManager.CurrentUser.UserName);
            GetListMenu(listmenu);
            //SessionManager.ThongTinChung = _accountService.GetThongTinChung(SessionManager.CurrentUser.UserName);
            ViewBag.ListNhaXuong = _combobox.GetCbbDiaDiem(SessionManager.CurrentUser.UserName, SessionManager.CurrentUser.TypeLangue, 1, 1);
            ViewBag.MS_MAY = msmay;
            ViewBag.TEN_MAY = "";
            ViewBag.FLAG = 1;
            var ticketMaintenance = _maintenanceService.GetTicketMaintenanceByDevice(mspbt);
            ViewBag.LoaiBaoTri = _combobox.GetMaintenanceCategoy(-1);
            ViewBag.UuTien = _combobox.GetPriorityCategory(SessionManager.CurrentUser.TypeLangue);
            return View("~/Views/WorkOrder/Index.cshtml", ticketMaintenance);
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

        public IActionResult Moningtoring(string msgstt, string msmay, string tenmay, int flag)
        {
            res = null;
            ViewBag.MS_MAY = msmay;
            ViewBag.TEN_MAY = tenmay;
            ViewBag.FLAG = flag;
            ViewBag.UuTien = _combobox.GetPriorityCategory(SessionManager.CurrentUser.TypeLangue);
            var morningtoring = _homeService.GetMorningToring(msgstt, SessionManager.CurrentUser.UserName, msmay, flag == 1 ? true : false);
            return View("~/Views/Moningtoring/Index.cshtml", morningtoring);
        }
        public IActionResult UserRequest(string msyc, string msmay, string tenmay, int flag)
        {
            res = null;
            ViewBag.MS_MAY = msmay;
            ViewBag.TEN_MAY = tenmay;
            ViewBag.FLAG = flag;
            UserRequestViewModel userequest = new UserRequestViewModel();
            try
            {
                userequest = _homeService.GetUserRequest(msyc, msmay, SessionManager.CurrentUser.UserName, flag);
                if (userequest != null && !string.IsNullOrEmpty(userequest.Files))
                {
                    var files = Newtonsoft.Json.JsonConvert.DeserializeObject<List<ImageFiles>>(userequest.Files);
                    var lst = files != null ? files.Select(x => x.DUONG_DAN).ToList() : new List<string>();
                    var lstBase64 = new List<string>();
                    foreach (var item in lst)
                    {
                        if (SessionManager.ThongTinChung.LUU_FILE == 2)
                            lstBase64.Add(_ftpservice.DownloadFileAsBase64(item));
                        else
                            lstBase64.Add(item.ToBase64StringImage());
                    }
                    ViewBag.DanhSachHinhAnh = lstBase64;
                }
            }
            catch
            {
            }
            if (flag == 1)
            {
                ViewBag.NguyenNhan = _combobox.DanhSachNguyenNhan("", true, SessionManager.CurrentUser.TypeLangue);
            }
            else
            {
                ViewBag.NguyenNhan = _combobox.DanhSachNguyenNhan(msmay, false, SessionManager.CurrentUser.TypeLangue);
            }
            ViewBag.UuTien = _combobox.LoadListUuTien(SessionManager.CurrentUser.TypeLangue);
            return View("~/Views/UserRequest/Index.cshtml", userequest);
        }
        [Route("Home/WorkOrder")]
        public IActionResult WorkOrder(string mspbt, string msmay, string tenmay, int flag, string ttmay, int msut)
        {
            res = null;
            ViewBag.MS_MAY = msmay;
            ViewBag.TEN_MAY = tenmay;
            ViewBag.FLAG = flag;
            var ticketMaintenance = _maintenanceService.GetTicketMaintenanceByDevice(mspbt, SessionManager.CurrentUser.UserName, msmay, flag == 1 ? false : true);
            if (flag != 1)
            {
                ticketMaintenance.TINH_TRANG_MAY = ttmay;
                ViewBag.LoaiBaoTri = _combobox.GetMaintenanceCategoy(2);
            }
            else
            {
                ViewBag.LoaiBaoTri = _combobox.GetMaintenanceCategoy(-1);
            }
            if (ttmay != null)
            {
                ticketMaintenance.MS_UU_TIEN = msut;
            }
            ViewBag.UuTien = _combobox.GetPriorityCategory(SessionManager.CurrentUser.TypeLangue);
            return View("~/Views/WorkOrder/Index.cshtml", ticketMaintenance);
        }

        public IActionResult WorkOrderRQ(string mspbt, string msmay, string tenmay)
        {
            ViewBag.MS_MAY = msmay;
            ViewBag.TEN_MAY = tenmay;
            ViewBag.FLAG = 2;
            var ticketMaintenance = _maintenanceService.GetTicketMaintenanceByDevice(mspbt);
            ViewBag.LoaiBaoTri = _combobox.GetMaintenanceCategoy(-1);
            ViewBag.UuTien = _combobox.GetPriorityCategory(SessionManager.CurrentUser.TypeLangue);
            return View("~/Views/WorkOrder/Index.cshtml", ticketMaintenance);
        }
        public ActionResult getDevices(string WorkSiteID, int coall)
        {
            SelectList lst = _combobox.GetCbbMay(WorkSiteID, -1, SessionManager.CurrentUser.UserName, SessionManager.CurrentUser.TypeLangue, coall);
            return Json(lst);
        }
        private static void GetListMenu(List<string> listmenu)
        {
            List<MenuViewModel> menus = new();
            //menus.Add(GetMenuItem(Menu.MyEcomaint));
            //menus.Add(GetMenuItem(Menu.DiChuyenTB));

            //kiểm user đó có quyền ngiệm thu
            foreach (var item in listmenu)
            {
                if (item.Trim() != "")
                {
                    menus.Add(GetMenuItem(item));
                }
            }
            //menus.Add(GetMenuItem(Menu.NghiemThuPBT));
            //menus.Add(GetMenuItem(Menu.KiemKeTB));
            //menus.Add(GetMenuItem(Menu.History));
            //menus.Add(GetMenuItem(Menu.TheoDoiYCBT));
            //menus.Add(GetMenuItem(Menu.NhapKho));
            //menus.Add(GetMenuItem(Menu.XuatKho));
            //menus.Add(GetMenuItem(Menu.BCXuatNhapTon));
            //menus.Add(GetMenuItem(Menu.Dashboard));
            SessionManager.Menus = menus;
        }
        private static MenuViewModel GetMenuItem(string menuItem)
        {
            switch (menuItem)
            {
                case "MyEcomaint":
                    return new MenuViewModel
                    {
                        MenuId = (int)Menu.MyEcomaint,
                        MenuName = ViewText.MNU_MY_ECOMAINT,
                        MenuIcon = "mytask.png",
                        MenuUrl = "/Home/Index",
                    };
                case "DiChuyenTB":
                    return new MenuViewModel
                    {
                        MenuId = (int)Menu.DiChuyenTB,
                        MenuName = ViewText.MNU_DI_CHUYEN_TB,
                        MenuIcon = "dichuyen.png",
                        MenuUrl = "/MoveDevice/Index",
                    };
                case "NghiemThuPBT":
                    return new MenuViewModel
                    {
                        MenuId = (int)Menu.NghiemThuPBT,
                        MenuName = ViewText.MNU_NGHIEM_THU_PBT,
                        MenuIcon = "nghiemthu.png",
                        MenuUrl = "/AcceptMaintenance/Index",
                    };
                case "KiemKeTB":
                    return new MenuViewModel
                    {
                        MenuId = (int)Menu.KiemKeTB,
                        MenuName = ViewText.MNU_KIEM_KE,
                        MenuIcon = "kiemke.png",
                        MenuUrl = "/InventoryDevice/Index",
                    };
                case "History":
                    return new MenuViewModel
                    {
                        MenuId = (int)Menu.History,
                        //MenuName = ViewText.TITLE_DANGKY_NGHI,
                        MenuName = ViewText.MNU_LICH_SU_TB,
                        MenuIcon = "lichsu.png",
                        MenuUrl = "/History/HistoryIndex",
                    };
                case "TheoDoiYCBT":
                    return new MenuViewModel
                    {
                        MenuId = (int)Menu.TheoDoiYCBT,
                        //MenuName = ViewText.TITLE_DANGKY_NGHI,
                        MenuName = ViewText.MNU_THEO_DOI_YC,
                        MenuIcon = "Theodoi.png",
                        MenuUrl = "/HistoryRequest/HistoryRequestIndex",
                    };
                case "NhapKho":
                    return new MenuViewModel
                    {
                        MenuId = (int)Menu.NhapKho,
                        MenuName = ViewText.MNU_NHAP_KHO,
                        MenuIcon = "import.png",
                        MenuUrl = "/GoodReceipt/Index",
                    };
                case "XuatKho":
                    return new MenuViewModel
                    {
                        MenuId = (int)Menu.XuatKho,
                        //MenuName = ViewText.TITLE_DANGKY_NGHI,
                        MenuName = ViewText.MNU_XUAT_KHO,
                        MenuIcon = "export.png",
                        MenuUrl = "/GoodIssue/Index",
                    };
                case "BCXuatNhapTon":
                    return new MenuViewModel
                    {
                        MenuId = (int)Menu.BCXuatNhapTon,
                        //MenuName = ViewText.TITLE_DANGKY_NGHI,
                        MenuName = ViewText.MNU_BC_NHAP_XUAT_TON,
                        MenuIcon = "Theodoi.png",
                        MenuUrl = "/BCNhapXuatTon/Index",
                    };
                case "Dashboard":
                    return new MenuViewModel
                    {
                        MenuId = (int)Menu.Dashboard,
                        MenuName = ViewText.MNU_DASHBOARD,
                        MenuIcon = "daskbord.png",
                        MenuUrl = "/Dashboard/Index",
                    };

                default:
                    return new MenuViewModel();
            }
        }
        public static List<MyEcomaintViewModel>? res;
        public IActionResult GetMyEcomain(string keyword, int pageIndex, int pageSize, string msnx, string mslmay, string denngay, bool xuly, bool locNV)
        {
            PagedList<MyEcomaintViewModel>? result = null;
            if (pageIndex == 1 && keyword == null)
            {
                var user = SessionManager.CurrentUser.UserName;
                DateTime? endDate = DateTime.ParseExact(denngay, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                res = _homeService.GetMyEcomain(user, SessionManager.CurrentUser.TypeLangue, endDate, msnx, mslmay, xuly, locNV, pageIndex, pageSize);
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

        private byte[] imgToByteConverter(byte[] imgConvert)
        {
            byte[] currentByteImageArray = imgConvert;
            double scale = 1f;
            MemoryStream inputMemoryStream = new MemoryStream(imgConvert);
            Image fullsizeImage = Image.FromStream(inputMemoryStream);
            while (currentByteImageArray.Length > 60000)
            {
                Bitmap fullSizeBitmap = new Bitmap(fullsizeImage, new Size((int)(fullsizeImage.Width * scale), (int)(fullsizeImage.Height * scale)));
                MemoryStream resultStream = new MemoryStream();
                fullSizeBitmap.Save(resultStream, fullsizeImage.RawFormat);
                currentByteImageArray = resultStream.ToArray();
                resultStream.Dispose();
                resultStream.Close();
                scale -= 0.05f;
            }

            return currentByteImageArray;
        }
        public IActionResult GetMonitoringParametersByDevice(string msmay, int isDue, int stt)
        {
            ViewBag.QUYEN_MENU = _homeService.QuyenMenuGSTT(SessionManager.CurrentUser.UserName) == 0 ? 0 : 1;
            List<MonitoringParametersByDevice> model = _homeService.GetMonitoringParametersByDevice(SessionManager.CurrentUser.UserName, SessionManager.CurrentUser.TypeLangue, msmay, isDue, stt);
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
                        item.Path = modelItem.Path;
                        item.Path64 = @"data:image/png;base64," + _ftpservice.DownloadFileAsBase64(item.Path);
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
        public async Task<ActionResult> SaveImage(IFormFile image, string dev, string msts)
        {
            try
            {
                string uploadedFiles = "";
                string base64String = "";
                if (SessionManager.ThongTinChung.LUU_FILE == 2)
                {
                    uploadedFiles = _ftpservice.UploadFiles(image, "GSTT\\" + msts + "\\" + dev);
                }
                else
                {
                    uploadedFiles = await SaveUploadFile(image, dev);

                }
                if (image != null)
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        await image.CopyToAsync(memoryStream);
                        byte[] fileBytes = memoryStream.ToArray();
                        // Convert the byte array to a Base64-encoded string.
                        base64String = @"data:image/png;base64," + Convert.ToBase64String(fileBytes);
                    }
                }
                else
                {
                    base64String = @"data:image/png;base64," + "";
                }


                return Json(new JsonResponseViewModel { Data = new Imagemodel { Path = uploadedFiles, Path64 = base64String }, ResponseCode = 1, ResponseMessage = Message.CAPNHAT_THANHCONG });
            }
            catch (Exception ex)
            {
                return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = Message.COLOI_XAYRA });
            }
        }

        [HttpPost]
        public async Task<ActionResult> SaveImageAvatar(IFormFile image)
        {
            try
            {
                if (_homeService.UpdateAvatar(SessionManager.CurrentUser.UserName, image) == 1)
                {
                    return Json(new JsonResponseViewModel { ResponseCode = 1, ResponseMessage = Message.CAPNHAT_THANHCONG });

                }
                else
                {
                    return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = Message.COLOI_XAYRA });

                }

            }
            catch (Exception ex)
            {
                return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = Message.COLOI_XAYRA });
            }
        }

        public FileResult DownloadFile(string filepath)
        {
            try
            {
                if (string.IsNullOrEmpty(filepath))
                    return File(Array.Empty<byte>(), "application/octet-stream");

                string filename = Path.GetFileName(filepath);
                byte[] filedata = System.IO.File.ReadAllBytes(filepath);

                string contentType;
                new FileExtensionContentTypeProvider().TryGetContentType(filename, out contentType);
                contentType = contentType ?? "application/octet-stream";

                var cd = new ContentDisposition
                {
                    FileName = filename,
                    Inline = true,
                };

                Response.Headers.Add("Content-Disposition", cd.ToString());
                return File(filedata, contentType);
            }
            catch
            {
                return File(Array.Empty<byte>(), "application/octet-stream");
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
        public async Task<ActionResult> SaveMonitoring(MorningToringViewModel model,string msmay, string jsonData)
        {
            //List<MonitoringParametersByDevice> lstParameter = Newtonsoft.Json.JsonConvert.DeserializeObject<List<MonitoringParametersByDevice>>(jsonData);
            BaseResponseModel? res = _homeService.SaveMonitoring(model,msmay, SessionManager.CurrentUser.UserName, jsonData);
            if (res.MA == 1)
            {
                return Json(new JsonResponseViewModel { ResponseCode = 1, ResponseMessage = Message.CAPNHAT_THANHCONG,Data = res.NAME });
            }
            else
            {
                return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = Message.COLOI_XAYRA });
            }
        }


        [HttpPost]
        public IActionResult ChonNguoiThucHien(int stt, string gstt, string msmay)
        {
            ViewBag.SO_PHIEU = gstt;
            ViewBag.MS_MAY = msmay;
            ViewBag.STT = stt;
            var res = _homeService.GetNguoiThucHienGS(SessionManager.CurrentUser.UserName, msmay, stt, SessionManager.CurrentUser.TypeLangue);
            return PartialView("~/Views/Moningtoring/_addNguoiThucHien.cshtml", res);
        }

        [HttpPost]
        public IActionResult SaveNguoiThucHien(int stt, string json)
        {
            var res = _homeService.SaveNguoiThucHienGS(stt, json);

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
                List<string> uploadedFiles = new List<string>();
                if (SessionManager.ThongTinChung.LUU_FILE == 2)
                {
                    model.MS_YEU_CAU = _homeService.GetSoPhieuYeu("WR");
                    uploadedFiles = _ftpservice.UploadMultipleFiles(files, "YCNSD\\" + model.MS_YEU_CAU);
                }
                else
                {
                    uploadedFiles = await SaveUploadFile(files, model.MS_MAY);
                }
                model.NGUOI_YEU_CAU = SessionManager.ThongTinChung.HO_TEN;
                if (model.HONG == true)
                {
                    try
                    {
                        model.NGAY_XAY_RA = DateTime.ParseExact(model.NGAY_XAY_RA_STR, Setting.FORMAT_DATETIME, null);
                    }
                    catch (Exception)
                    {
                        model.NGAY_XAY_RA = null;
                    }
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
            ViewBag.Image = image.Replace("data:image/png;base64,", "");
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


        public ActionResult ShowConfirmKhongDuyet(int loai, int stt, string tenmay, string msmay)
        {
            AcceptUserRequest model = new AcceptUserRequest();
            model.TEN_MAY = tenmay;
            model.MS_MAY = msmay;
            model.GHI_CHU = "";
            model.LOAI = loai;
            model.STT = stt;
            //loại 1 không duyệt; 2 duyệt; 3 bỏ qua tiếp nhận
            switch (loai)
            {
                case 1:
                    {
                        ViewBag.TITLE = ViewText.TITLE_KHONG_DUYET_YC;
                        break;
                    }
                case 2:
                    {
                        ViewBag.TITLE = ViewText.TITLE_DUYET_YC;
                        break;
                    }
                case 3:
                    {
                        ViewBag.TITLE = ViewText.TITLE_KHONG_TIEP_NHAN_YC;
                        break;
                    }
                default:
                    break;
            }
            return PartialView("~/Views/UserRequest/_ConfirmKhongDuyet.cshtml", model);
        }


        [HttpPost]
        public ActionResult SaveAcceptUserRequest(AcceptUserRequest data)
        {
            BaseResponseModel? res = _homeService.SaveAcceptUserRequest(SessionManager.CurrentUser.UserName, data);
            if (res.MA == 1)
            {
                return Json(new JsonResponseViewModel { ResponseCode = 1, ResponseMessage = Message.CAPNHAT_THANHCONG });
            }
            else
            {
                return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = res.NAME });
            }
        }

        [HttpPost]
        public IActionResult Completed(int stt)
        {
            var res = _homeService.Completed(stt, SessionManager.CurrentUser.UserName);
            if (res.MA == 1)
            {
                return Json(new JsonResponseViewModel { ResponseCode = 1, ResponseMessage = Message.CAPNHAT_THANHCONG });
            }
            else
            {
                return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = res.NAME });
            }
        }

        [HttpPost]
        public IActionResult DeleteGSTT(int stt)
        {
            var res = _homeService.DeleteGSTT(stt);
            if (res.MA == 1)
            {
                return Json(new JsonResponseViewModel { ResponseCode = 1, ResponseMessage = Message.CAPNHAT_THANHCONG });
            }
            else
            {
                return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = res.NAME });
            }
        }

    }
}