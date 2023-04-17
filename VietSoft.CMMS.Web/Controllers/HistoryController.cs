using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Diagnostics;
using System.Globalization;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Models;
using VietSoft.HRM.Web.Controllers;
using static Microsoft.Extensions.Logging.EventSource.LoggingEventSource;

namespace VietSoft.CMMS.Web.Controllers
{

    public class HistoryController : BaseController
    {
        private readonly ILogger<HistoryController> _logger;
        private readonly IAccountService _accountService;
        private readonly IComboboxService _combobox;
        private readonly IHistoryService _historyService;


        public HistoryController(ILogger<HistoryController> logger, IAccountService accountService, IComboboxService combobox, IHistoryService historyService)
        {
            _logger = logger;
            _accountService = accountService;
            _combobox = combobox;
            _historyService = historyService;
        }

        [AllowAnonymous]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        public IActionResult HistoryIndex()
        {
            SelectList listMAY = _combobox.GetCbbMay("-1", -1, SessionManager.CurrentUser.UserName, SessionManager.CurrentUser.TypeLangue, 1);
            SelectListItem itemMay = listMAY.Where(x => x.Value.ToString() == "-1").FirstOrDefault();
            itemMay.Text = "";
            ViewBag.ListMAY = listMAY;

            ViewBag.ListBoPhan = _combobox.GetCbbBoPhan("-1",SessionManager.CurrentUser.UserName, SessionManager.CurrentUser.TypeLangue, 1);
            ViewBag.ListPhuTung = _combobox.GetCbbPhuTung("-1","-1",SessionManager.CurrentUser.UserName, SessionManager.CurrentUser.TypeLangue, 1);
            return View();
        }
        public ActionResult getBoPhan(string msmay)
        {
            SelectList lst = _combobox.GetCbbBoPhan(msmay, SessionManager.CurrentUser.UserName, SessionManager.CurrentUser.TypeLangue, 1);
            return Json(lst);
        }

        public ActionResult getPhuTung(string msmay,string msbp)
        {
            SelectList lst = _combobox.GetCbbPhuTung(msmay, msbp, SessionManager.CurrentUser.UserName, SessionManager.CurrentUser.TypeLangue, 1);
            return Json(lst);
        }

        public ActionResult getTuNgay(string msmay)
        {
            DateTime tnngay = _historyService.GetNgayLapDat(msmay);
            return Json(tnngay.ToString("dd/MM/yyyy"));
        }

        public static List<HistoryViewModel>? res;
        public IActionResult GetListHistory(string keySeach, int pageIndex, int pageSize, string msmay, string tungay, string denngay, bool ttphutung, string mabp, string mapt)
        {
            PagedList<HistoryViewModel>? result = null;
            var user = SessionManager.CurrentUser.UserName;
            if (pageIndex == 1 && keySeach == null)
            {
                DateTime? toDate = DateTime.ParseExact(tungay, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                DateTime? fromDate = DateTime.ParseExact(denngay, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                res = _historyService.GetListHistory(user, SessionManager.CurrentUser.TypeLangue, toDate, fromDate, msmay, ttphutung, mabp, mapt, pageIndex, pageSize);
                result = new PagedList<HistoryViewModel>(res, res.Count, pageIndex, pageSize);
            }
            else
            {
                if (keySeach != null)
                {
                    result = new PagedList<HistoryViewModel>(res.Where(x => x.MA_BP.ToLower().Contains(keySeach.ToLower()) || x.NGAY.ToLower().Contains(keySeach.ToLower()) || x.MA_PT.ToLower().Contains(keySeach.ToLower())).ToList(), res.Count(x => x.MA_BP.ToLower().Contains(keySeach.ToLower()) || x.NGAY.ToLower().Contains(keySeach.ToLower()) || x.MA_PT.ToLower().Contains(keySeach.ToLower())), pageIndex, pageSize);
                }
                else
                {
                    result = new PagedList<HistoryViewModel>(res, res.Count, pageIndex, pageSize);
                }
            }

            return PartialView("_historyDetail", result);
        }
    }
}
