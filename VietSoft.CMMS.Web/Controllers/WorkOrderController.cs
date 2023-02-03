using Microsoft.AspNetCore.Mvc;
using VietSoft.CMMS.Web.Models;

namespace VietSoft.CMMS.Web.Controllers
{
    public class WorkOrderController : Controller
    {
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

        public IActionResult LogWork()
        {
            return PartialView("_logWork");
        }

    }
}
