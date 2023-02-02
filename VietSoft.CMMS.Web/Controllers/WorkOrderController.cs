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

        [HttpGet]
        public IActionResult ViewCauseOfDamage()
        {
            return PartialView("_viewCauseOfDamage");
        }
    }
}
