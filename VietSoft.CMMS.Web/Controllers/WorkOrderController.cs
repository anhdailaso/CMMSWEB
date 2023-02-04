using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Models;

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

        public IActionResult GetCauseOfDamageList(string keyword)
        {
            var res = 1;

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

        public IActionResult GetInputCauseOfDamageList(string keyword)
        {
            var res = 1;

            return Json(new JsonResponseViewModel { ResponseCode = 1, Data = res });
        }

        public IActionResult LogWork(string ticketId)
        {
            var res = _maintenanceService.GetLogWorkList(ticketId);
            return PartialView("_logWork", res);
        }

        public IActionResult GetWorkList(string deviceId, string ticketId)
        {
            var res = _maintenanceService.GetWorkOrderList(userName, deviceId, ticketId);
            return PartialView("_workList", res);
        }

        public IActionResult AddSupplies(string suppliesSelectedJson, string deviceId, string dept)
        {
            dept = "00";
            var suppliesSelected = JsonSerializer.Deserialize<List<string>>(suppliesSelectedJson);
            var res = _maintenanceService.GetSuppliesList(userName, deviceId, dept);
            var lst = res.Where(x => !suppliesSelected.Contains(x.MS_PT)).ToList();
            return PartialView("_addSupplies", lst);
        }

        public IActionResult AddMaintenanceWork(string deviceId)
        {
            var res = _maintenanceService.GetJobList(userName, deviceId);
            return PartialView("_addMaintenanceWork", res);
        }

    }
}
