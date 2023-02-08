using Microsoft.AspNetCore.Mvc;
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
        private readonly string userName;
        public WorkOrderController(IMaintenanceService maintenanceService)
        {
            _maintenanceService = maintenanceService;
            userName = SessionManager.CurrentUser.UserName;
        }

        public IActionResult GetCauseOfDamageList(string keyword, string deviceId)
        {
            var res = _maintenanceService.GetViewCauseOfDamageList(deviceId);

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

        public IActionResult GetWorkList(string deviceId, string ticketId)
        {
            var res = _maintenanceService.GetWorkOrderList(userName, deviceId, ticketId);
            return PartialView("_workList", res);
        }

        public IActionResult AddSupplies(string suppliesSelectedJson, string deviceId, string dept, int workId, string ticketId)
        {
            @ViewBag.MS_CV = workId;
            @ViewBag.MS_BO_PHAN = dept;
            var suppliesSelected = suppliesSelectedJson == null ? new List<string>() : JsonSerializer.Deserialize<List<string>>(suppliesSelectedJson);
            var res = _maintenanceService.GetSuppliesList(userName, deviceId, dept, ticketId);
            var lst = suppliesSelected == null ? res : res.Where(x => !suppliesSelected.Contains(x.MS_PT)).ToList();
            return PartialView("_addSupplies", lst);
        }

        public IActionResult AddMaintenanceWork(string deviceId, string ticketId)
        {
            var res = _maintenanceService.GetJobList(userName, deviceId, ticketId);
            return PartialView("_addMaintenanceWork", res);
        }

        [HttpPost]
        public IActionResult SaveMaintenanceWork(SaveMaintenanceWorkModel model)
        {
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(model.WorkList);
            var res = _maintenanceService.SaveMaintenanceWork(model.DEVICE_ID, model.MS_PHIEU_BAO_TRI, userName, json);

            if (res.MA == 1)
            {
                return Json(new JsonResponseViewModel { ResponseCode = 1, ResponseMessage = res.NAME });
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
        public IActionResult SaveLogWork(SaveLogWorkModel model)
        {
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
    }
}
