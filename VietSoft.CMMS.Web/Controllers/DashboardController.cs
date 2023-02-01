using Microsoft.AspNetCore.Mvc;
using VietSoft.CMMS.Web.Helpers;
using Newtonsoft.Json;
using VietSoft.CMMS.Web.Controllers;
using VietSoft.CMMS.Web.IServices;

namespace VietSoft.HRM.Web.Controllers
{
    public class DashboardController : BaseController
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IAccountService _accountService;
        private readonly IChartService _chart;

        public DashboardController(ILogger<HomeController> logger, IAccountService accountService, IChartService chart)
        {
            _logger = logger;
            _accountService = accountService;
            _chart = chart;
        }
        public ActionResult Index()
        {
            var us = _accountService.GetProfile(SessionManager.CurrentUser.UserName);
            ViewBag.TenNguoiDung = us.FullName;
            ViewBag.Username = us.UserName;
            ViewBag.PhongBan = us.Department;
            ViewBag.SoMay = _chart.GetSoMay().ToString();
            return View();
        }
        public JsonResult GetDeviceInfo()
        {
            string data = JsonConvert.SerializeObject(_chart.GetDeviceInfo(SessionManager.CurrentUser.UserName).ToList()).Replace("y\":\"", "y\":").Replace("\",\"color\":", ",\"color\":");
            return Json(data);
        }

        public JsonResult GetDeviceStatus()
        {
            string data = JsonConvert.SerializeObject(_chart.GetDeviceStatus(SessionManager.CurrentUser.UserName).ToList()).Replace("y\":\"", "y\":").Replace("\",\"color\":", ",\"color\":");
            return Json(data);
        }

        public JsonResult GetSituationWO()
        {
            string data = JsonConvert.SerializeObject(_chart.GetSituationWO().ToList()).Replace("\"[", "[").Replace("]\"", "]");
            return Json(data);
        }

        public JsonResult GetSituationWOColumn()
        {
            string data = JsonConvert.SerializeObject(_chart.GetSituationWOColumn(SessionManager.CurrentUser.UserName).ToList()).Replace("\"[", "[").Replace("]\"", "]");
            return Json(data);
        }

    }
}