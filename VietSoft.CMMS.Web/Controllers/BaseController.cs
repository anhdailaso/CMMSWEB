using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.Helpers;

namespace VietSoft.CMMS.Web.Controllers
{
    [CustomAuthorize]
    public class BaseController : Controller
    {
        public BaseController()
        {

        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult ClearMessage()
        {
            MessageUtil.ClearMessage();
            return Json(new { Message = "Success" });
        }
    }
}
