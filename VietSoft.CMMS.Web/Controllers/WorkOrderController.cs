using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using System.Globalization;
using System.IO;
using System.Net.Mime;
using System.Runtime.CompilerServices;
using System.Text.Json;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Models;
using VietSoft.CMMS.Web.Models.Maintenance;
using VietSoft.CMMS.Web.Resources;
using JsonConvert = Newtonsoft.Json;

namespace VietSoft.CMMS.Web.Controllers
{
    public class WorkOrderController : Controller
    {
        private readonly IMaintenanceService _maintenanceService;
        private readonly IComboboxService _combobox;
        private readonly string userName;
        public WorkOrderController(IMaintenanceService maintenanceService, IComboboxService combobox)
        {
            _maintenanceService = maintenanceService;
            _combobox = combobox;
            userName = SessionManager.CurrentUser.UserName;
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

        public IActionResult InputCauseOfDamage()
        {
            return PartialView("_inputCauseOfDamage");
        }

        public IActionResult GetInputCauseOfDamageList(string deviceId, string ticketId)
        {
            var res = _maintenanceService.GetInputCauseOfDamageList(ticketId, deviceId);

            return Json(new JsonResponseViewModel { ResponseCode = 1, Data = res });
        }

        public IActionResult LogWork(string ticketId)
        {
            var res = _maintenanceService.GetLogWorkList(ticketId, userName);
            return PartialView("_logWork", res);
        }

        public IActionResult ViewInventory(string ticketId)
        {
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


        public IActionResult GetInventory(string mskho, string ticketId)
        {
            var res = _maintenanceService.GetListInventory(ticketId, mskho);
            return PartialView("_Inventory", res);
        }

        public IActionResult GetWorkList(string deviceId, string ticketId)
        {
            var res = _maintenanceService.GetWorkOrderList(userName, deviceId, ticketId, SessionManager.CurrentUser.TypeLangue);
            return PartialView("_workList", res);
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
            catch(Exception ex)
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
            var res = _maintenanceService.GetJobList(userName, deviceId, ticketId , SessionManager.CurrentUser.TypeLangue);
            return PartialView("_addMaintenanceWork", res);
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


        [HttpPost]
        public IActionResult SaveLogWork(SaveLogWorkModel model)
        {

            model.LogWorkList = model.LogWorkList.Select(x =>
            {
                x.NGAY = DateTime.ParseExact(x.S_NGAY, Setting.FORMAT_DATETIME, null);
                x.DEN_NGAY = DateTime.ParseExact(x.S_DEN_NGAY, Setting.FORMAT_DATETIME, null);
                return x;
            });
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
        public IActionResult SaveInputCauseOfDamageList(SaveCauseOfDamageInputModel model)
        {
            var causeOfDamages = new List<SaveCauseOfDamageModel>();
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

            var json = Newtonsoft.Json.JsonConvert.SerializeObject(causeOfDamages);
            var res = _maintenanceService.SaveInputCauseOfDamageList(model.MS_PHIEU_BAO_TRI, json);

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
            DateTime dateOut;
            DateTime.TryParseExact(model.S_NGAY_KT_KH, Setting.FORMAT_DATE, null, DateTimeStyles.None, out dateOut) ;
            var res = _maintenanceService.SaveWorkOrder(model.MS_PHIEU_BAO_TRI, dateOut, model.MS_LOAI_BT, model.MS_UU_TIEN, model.TINH_TRANG_MAY, userName, deviceId);

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
                if(res.NAME == "SHOW_HH")
                {
                    return Json(new JsonResponseViewModel { ResponseCode = 2, ResponseMessage = Message.CAPNHAT_THANHCONG });
                }
                else
                {
                    return Json(new JsonResponseViewModel { ResponseCode = 1, ResponseMessage = Message.CAPNHAT_THANHCONG });
                }
            }
            else
            {
                return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = res.NAME });
            }
        }
    }
}
