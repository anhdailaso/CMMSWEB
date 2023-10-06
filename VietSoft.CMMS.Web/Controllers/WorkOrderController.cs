using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.StaticFiles;
using System.Globalization;
using System.Net.Mime;
using System.Text.Json;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Models;
using VietSoft.CMMS.Web.Models.Maintenance;
using VietSoft.CMMS.Web.Resources;

namespace VietSoft.CMMS.Web.Controllers
{
    public class WorkOrderController : Controller
    {
        private readonly IMaintenanceService _maintenanceService;
        private readonly IComboboxService _combobox;
        private readonly IFtpService _ftpservice;
        private readonly string userName;

        public WorkOrderController(IMaintenanceService maintenanceService, IComboboxService combobox, IFtpService ftpservice)
        {
            _maintenanceService = maintenanceService;
            _combobox = combobox;
            userName = SessionManager.CurrentUser.UserName;
            _ftpservice = ftpservice;
        }

        public IActionResult GetCauseOfDamageList(string keyword, string deviceId)
        {
            var res = _maintenanceService.GetViewCauseOfDamageList(deviceId, keyword);

            return Json(new JsonResponseViewModel { ResponseCode = 1, Data = res });
        }

        public IActionResult ViewCauseOfDamage()
        {
            return PartialView("_viewCauseOfDamage");
        }

        public IActionResult InputCauseOfDamage(string ticketId, string deviceId)
        {
            try
            {
                ViewBag.MS_PBT = ticketId;
                ViewBag.MS_MAY = deviceId;
                ViewBag.NguyenNhan = _combobox.DanhSachNguyenNhan(deviceId, false, SessionManager.CurrentUser.TypeLangue).Where(x => x.Text.Trim() != "");
                var res = _maintenanceService.GetThoiGianNgungMay(ticketId, userName, SessionManager.CurrentUser.TypeLangue, true);
                return PartialView("_inputCauseOfDamage", res);
            }
            catch (Exception ex)
            {
                return null;
            }

        }

        public IActionResult GetInputCauseOfDamageList(string deviceId, string ticketId)
        {
            var res = _maintenanceService.GetInputCauseOfDamageList(ticketId, deviceId);

            return Json(new JsonResponseViewModel { ResponseCode = 1, Data = res });
        }

        public IActionResult LogWork(string ticketId, string deviceId)
        {
            ViewBag.MS_PBT = ticketId;
            ViewBag.MS_MAY = deviceId;
            var cboCongNhan = _maintenanceService.GetNguoiThucHien(userName, deviceId, ticketId, SessionManager.CurrentUser.TypeLangue);

            ViewBag.CongNhan = cboCongNhan.Select(
            x => new SelectListItem
            {
                Text = x.TEN_CONG_NHAN,
                Value = x.MS_CONG_NHAN
            });

            var res = _maintenanceService.GetLogWorkList(ticketId, userName);
            return PartialView("_logWork", res);
        }

        public IActionResult ViewInventory(string ticketId, string deviceId)
        {
            ViewBag.MS_PBT = ticketId;
            ViewBag.MS_MAY = deviceId;
            ViewBag.ListKho = _combobox.DanhSachKho(SessionManager.CurrentUser.UserName);
            //kiểm tra c
            return PartialView("_viewInventory");
        }

        public IActionResult CHECK_TON_KHO(string ticketId)
        {

            if (_maintenanceService.CheckPhuTung(ticketId))
            {

                return Json(new JsonResponseViewModel { ResponseCode = 1, ResponseMessage = Message.CAPNHAT_THANHCONG });
            }
            else
            {
                return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = Message.MESS_CHUA_CO_PHU_TUNG });
            }
        }

        public IActionResult UPDATE_TT_HT(string ticketId)
        {
            var res = _maintenanceService.UpdateTinhTrang(ticketId);
            return PartialView("_workList", res);
        }


        public IActionResult GetInventory(string mskho, string ticketId)
        {
            var res = _maintenanceService.GetListInventory(ticketId, mskho);
            return PartialView("_Inventory", res);
        }

        public IActionResult GetWorkList(string deviceId, string ticketId, int huhong)
        {
            ViewBag.HU_HUONG = huhong;
            IEnumerable<WorkOrdersViewModel> res = _maintenanceService.GetWorkOrderList(userName, deviceId, ticketId, SessionManager.CurrentUser.TypeLangue);
            return PartialView("_workList", res);
        }

        public FileResult DownloadFile(string filepath)
        {
            try
            {
                if (string.IsNullOrEmpty(filepath))
                    return File(Array.Empty<byte>(), "application/octet-stream");

                string filename = Path.GetFileName(filepath);
                byte[] filedata;
                //if (SessionManager.ThongTinChung.LUU_FILE == 2)
                //{
                //    filedata = _ftpservice.DownloadFileAsBytes(filepath);
                //}   
                //else
                //{
                    filedata = Commons.DownloadFileAsBytes(filepath).Result;
                //}
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
            catch (Exception ex)
            {
                return File(Array.Empty<byte>(), "application/octet-stream");
            }
        }

        public IActionResult AddSupplies(string suppliesSelectedJson, string deviceId, string dept, int workId, string ticketId)
        {
            @ViewBag.MS_CV = workId;
            @ViewBag.MS_BO_PHAN = dept;
            var suppliesSelected = suppliesSelectedJson == null ? new List<string>() : JsonSerializer.Deserialize<List<string>>(suppliesSelectedJson);
            var res = _maintenanceService.GetSuppliesList(userName, deviceId, dept, ticketId, SessionManager.CurrentUser.TypeLangue);
            var lst = suppliesSelected == null ? res : res.Where(x => !suppliesSelected.Contains(x.MS_PT)).ToList();
            return PartialView("_addSupplies", lst);
        }

        public IActionResult AddMaintenanceWork(string deviceId, string ticketId)
        {
            ViewBag.MS_PBT = ticketId;
            ViewBag.MS_MAY = deviceId;
            var res = _maintenanceService.GetJobList(userName, deviceId, ticketId, SessionManager.CurrentUser.TypeLangue);
            return PartialView("_addMaintenanceWork", res);
        }

        public IActionResult THEM_CONG_VIEC(string deviceId, string ticketId)
        {
            ViewBag.MS_PBT = ticketId;
            ViewBag.MS_MAY = deviceId;
            ViewBag.cboBoPhan = _combobox.GetCbbBoPhan(deviceId, SessionManager.CurrentUser.UserName, SessionManager.CurrentUser.TypeLangue);
            ViewBag.cboCongViec = _combobox.GetCbbTrong();
            return PartialView("_ThemCongViec");
        }

        public IActionResult XEM_HUONG_DAN(string thaotac, string tieuchuanKT, string yeucauNS, string yeucauDC, string MotaCV)
        {
            ViewBag.ThaoTac = thaotac;
            ViewBag.TieuChuanKT = tieuchuanKT;
            ViewBag.YeuCauNS = yeucauNS;
            ViewBag.YeuCauDC = yeucauDC;
            ViewBag.MotaCV = MotaCV;
            return PartialView("_XemHuongDan");
        }

        public ActionResult LoadComBoCongViec(string deviceId, string msbp)
        {
            SelectList lst = _combobox.GetCbbCongViec(deviceId, msbp, SessionManager.CurrentUser.TypeLangue);
            return Json(lst);
        }

        public IActionResult ChonNguoiThucHien(string deviceId, string ticketId)
        {
            ViewBag.MS_PBT = ticketId;
            ViewBag.MS_MAY = deviceId;
            var res = _maintenanceService.GetNguoiThucHien(userName, deviceId, ticketId, SessionManager.CurrentUser.TypeLangue);
            return PartialView("_addNguoiThucHien", res);
        }

        public IActionResult ShowMessage(string deviceId, string ticketId)
        {
            ViewBag.MS_PBT = ticketId;
            ViewBag.MS_MAY = deviceId;
            // Tạo một SelectListItem rỗng
            var emptyItem = new SelectListItem
            {
                Text = "", // Đặt Text là chuỗi trống
                Value = ""  // Đặt Value là chuỗi trống
            };
            // Lấy danh sách công nhân từ _maintenanceService
            var cboCongNhan = _maintenanceService.GetNguoiThucHien(userName, deviceId, ticketId, SessionManager.CurrentUser.TypeLangue);

            // Tạo danh sách SelectListItem từ danh sách công nhân, bao gồm cả emptyItem
            var selectListItems = new List<SelectListItem>
            {
                emptyItem
            };
            selectListItems.AddRange(cboCongNhan.Select(x => new SelectListItem
            {
                Text = x.TEN_CONG_NHAN,
                Value = x.MS_CONG_NHAN
            }));
            // Đặt danh sách SelectListItem vào ViewBag.CongNhan
            ViewBag.CongNhan = selectListItems;

            return PartialView("_Message");
        }
        public IActionResult GetMessage(string ticketId)
        {
            var res = _maintenanceService.GetThongtinTraoDoi(ticketId);
            return PartialView("_addMessage", res);
        }
        [HttpPost]
        public IActionResult AddMessage(string ticketId, string noidung,string guithem)
        {
            var res = _maintenanceService.AddMessage(ticketId,noidung,guithem,SessionManager.CurrentUser.UserName);

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
        public IActionResult SaveMaintenanceWork(SaveMaintenanceWorkModel model)
        {
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(model.WorkList);
            var res = _maintenanceService.SaveMaintenanceWork(model.DEVICE_ID, model.MS_PHIEU_BAO_TRI, userName, json);

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
        public IActionResult SaveNguoiThucHien(string ticketId, string json)
        {
            var res = _maintenanceService.SaveNguoiThucHien(ticketId, json);

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
        public IActionResult ThemCongViecPhuTung(string deviceId, string msbp, int mscv, string tenCV, int thoigian, bool them)
        {
            var res = _maintenanceService.ThemCauTrucCongViec(deviceId, msbp, mscv, tenCV, thoigian, them);

            if (res.MA == 1)
            {
                return Json(new JsonResponseViewModel { ResponseCode = 1, ResponseMessage = Message.CAPNHAT_THANHCONG });
            }
            else
            {
                return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = Message.COLOI_XAYRA });
            }
            return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = Message.COLOI_XAYRA });
        }


        [HttpPost]
        public IActionResult SaveSupplies(SaveSuppliesModel model)
        {
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(model.SuppliesList);
            var res = _maintenanceService.SaveSupplies(model.DEVICE_ID, model.MS_PHIEU_BAO_TRI, userName, model.MS_CV, model.MS_BO_PHAN, json);

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
        public IActionResult BackLog(SaveSuppliesModel model)
        {
            var res = _maintenanceService.Backlog(model.MS_PHIEU_BAO_TRI, userName, model.MS_CV, model.MS_BO_PHAN);

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
        public IActionResult DeleteWork(SaveSuppliesModel model)
        {
            var res = _maintenanceService.DeleteWork(model.MS_PHIEU_BAO_TRI, userName, model.MS_CV, model.MS_BO_PHAN, SessionManager.CurrentUser.TypeLangue);
            if (res.MA == 1)
            {
                return Json(new JsonResponseViewModel { ResponseCode = 1, ResponseMessage = Message.CAPNHAT_THANHCONG });
            }
            else
            {
                return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = res.NAME });
            }
        }
        public IActionResult DeleteWorkOrder(SaveSuppliesModel model)
        {
            var res = _maintenanceService.DeleteWorkOrder(model.MS_PHIEU_BAO_TRI, userName, SessionManager.CurrentUser.TypeLangue);
            if (res.MA == 1)
            {
                return Json(new JsonResponseViewModel { ResponseCode = 1, ResponseMessage = Message.CAPNHAT_THANHCONG });
            }
            else
            {
                return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = res.NAME });
            }
        }

        public IActionResult AddRowLogwork(SaveLogWorkModel model, string deviceId)
        {
            var cboCongNhan = _maintenanceService.GetNguoiThucHien(userName, deviceId, "-1", SessionManager.CurrentUser.TypeLangue);
            ViewBag.CongNhan = cboCongNhan.Select(
            x => new SelectListItem
            {
                Text = x.TEN_CONG_NHAN,
                Value = x.MS_CONG_NHAN
            });
            try
            {
                model.LogWorkList = model.LogWorkList.Select(x =>
                {
                    x.NGAY = DateTime.ParseExact(x.S_NGAY, Setting.FORMAT_DATETIME, null);
                    x.DEN_NGAY = DateTime.ParseExact(x.S_DEN_NGAY, Setting.FORMAT_DATETIME, null);
                    return x;
                });
            }
            catch
            {
            }
            List<LogWorkViewModel> list = new List<LogWorkViewModel>();
            LogWorkViewModel item = new LogWorkViewModel();
            DateTime dt = DateTime.Now;
            item.NGAY = dt;
            item.DEN_NGAY = dt.AddHours(1);
            item.MS_CONG_NHAN = SessionManager.CurrentUser.MS_CONG_NHAN;
            item.S_NGAY = "";
            item.S_DEN_NGAY = "";
            item.SO_GIO = 60;
            try
            {
                list = model.LogWorkList.ToList();
            }
            catch
            {
            }
            list.Add(item);
            ViewBag.MS_PBT = model.MS_PHIEU_BAO_TRI;
            ViewBag.MS_MAY = deviceId;
            return PartialView("_logWork", list);
        }




        [HttpPost]
        public IActionResult SaveLogWork(SaveLogWorkModel model)
        {
            model.LogWorkList = model.LogWorkList.Select(x =>
            {
                x.NGAY = DateTime.ParseExact(x.S_NGAY, Setting.FORMAT_DATETIME, null);
                x.DEN_NGAY = DateTime.ParseExact(x.S_DEN_NGAY, Setting.FORMAT_DATETIME, null);
                return x;
            });

            List<string> mscn = new List<string>();
            mscn = model.LogWorkList.Select(x => x.MS_CONG_NHAN).Distinct().ToList();
            foreach (var item in mscn)
            {
                var timeList = new List<Tuple<DateTime, DateTime>>();
                foreach (var logWorkViewModel in model.LogWorkList.Where(x => x.MS_CONG_NHAN == item.ToString()).OrderBy(x => x.NGAY).ToList())
                {
                    timeList.Add(Tuple.Create(logWorkViewModel.NGAY, logWorkViewModel.DEN_NGAY));
                }
                if (Commons.CheckTimeOverlap(timeList))
                {
                    return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = Message.MESS_KHOAN_TG_TON_TAI });
                }
            }

            var json = Newtonsoft.Json.JsonConvert.SerializeObject(model.LogWorkList);
            var res = _maintenanceService.SaveLogWork(model.MS_PHIEU_BAO_TRI, userName, json);
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
        public IActionResult SaveInputCauseOfDamageList(SaveCauseOfDamageInputModel model, int msnn, string tungay, string denngay)
        {
            var causeOfDamages = new List<SaveCauseOfDamageModel>();
            string json = "";
            try
            {
                foreach (var item in model.Keys)
                {
                    var ids = item.Split('|');
                    var causeOfDamage = new SaveCauseOfDamageModel()
                    {
                        MS_MAY = ids[0],
                        MS_BO_PHAN = ids[1],
                        CLASS_ID = ids[2],
                        PROBLEM_ID = ids[3],
                        CAUSE_ID = ids[4],
                        REMEDY_ID = ids[5]
                    };

                    causeOfDamages.Add(causeOfDamage);
                }
                json = Newtonsoft.Json.JsonConvert.SerializeObject(causeOfDamages);

            }
            catch
            {
                json = "";
            }

            DateTime TN = DateTime.ParseExact(tungay, "dd/MM/yyyy HH:mm", CultureInfo.InvariantCulture);
            DateTime DN = DateTime.ParseExact(denngay, "dd/MM/yyyy HH:mm", CultureInfo.InvariantCulture);

            if (TN > DN)
            {
                return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = Message.MESS_TN_KHONG_LON_HON_DN });
            }

            var res = _maintenanceService.SaveInputCauseOfDamageList(model.MS_PHIEU_BAO_TRI, msnn, TN, DN, json, userName);
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
        public IActionResult SaveWorkOrder(TicketMaintenanceViewModel model, string deviceId)
        {
            DateTime ngaylap;
            DateTime.TryParseExact(model.S_NGAY_LAP, Setting.FORMAT_DATE, null, DateTimeStyles.None, out ngaylap);

            DateTime ngayBD;
            DateTime.TryParseExact(model.S_NGAY_BD_KH, Setting.FORMAT_DATE, null, DateTimeStyles.None, out ngayBD);

            DateTime ngayKT;
            DateTime.TryParseExact(model.S_NGAY_KT_KH, Setting.FORMAT_DATE, null, DateTimeStyles.None, out ngayKT);

            var res = _maintenanceService.SaveWorkOrder(model.MS_PHIEU_BAO_TRI, ngaylap, ngayBD, ngayKT, model.MS_LOAI_BT, model.MS_UU_TIEN, model.TINH_TRANG_MAY, model.GHI_CHU, userName, deviceId, model.THEM);

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
        public IActionResult CompletedWorkOrder(string ticketId, string deviceId)
        {
            var res = _maintenanceService.CompletedWorkOrder(ticketId, userName, deviceId, SessionManager.CurrentUser.TypeLangue);
            if (res.MA == 1)
            {
                //if (res.NAME == "SHOW_HH")
                //{
                return Json(new JsonResponseViewModel { ResponseCode = 1, ResponseMessage = Message.CAPNHAT_THANHCONG });
                //}
                //else
                //{
                //    return Json(new JsonResponseViewModel { ResponseCode = 1, ResponseMessage = Message.CAPNHAT_THANHCONG });
                //}
            }
            else
            {
                return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = res.NAME });
            }
        }

        [HttpPost]
        public async Task<ActionResult> SaveImage(IFormFile image, string ticketId, string com, string work)
        {
            try
            {
                string uploadedFiles = "";
                string base64String = "";
                //uploadedFiles = _ftpservice.UploadFiles(image, "BTDK\\" + ticketId + "\\" + com + "_" + work);
                uploadedFiles = await Commons.SaveUploadFile(image, "BTDK\\" + ticketId + "\\" + com + "_" + work);
                _maintenanceService.SaveImagePBT(uploadedFiles, ticketId, com, work);
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

    }
}
