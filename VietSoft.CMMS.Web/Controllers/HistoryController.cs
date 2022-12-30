using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
        public IActionResult HistoryIndex()
        {
            ViewBag.ListMAY = _combobox.GetCbbMay("-1", -1, SessionManager.CurrentUser.UserName, 0, 1);
            ViewBag.ListBoPhan = _combobox.GetCbbBoPhan(SessionManager.CurrentUser.UserName, 0, 1);
            ViewBag.ListPhuTung = _combobox.GetCbbPhuTung(SessionManager.CurrentUser.UserName, 0, 1);
            return View();
        }

        public static List<HistoryViewModel>? res;
        public IActionResult GetListHistory(string keySeach, int pageIndex, int pageSize, string msmay, string tungay, string denngay, bool ttphutung, int mabp, string mapt)
        {
            PagedList<HistoryViewModel>? result = null;
            var user = SessionManager.CurrentUser.UserName;
            if (pageIndex == 1 && keySeach == null)
            {
                DateTime? toDate = ExtendedDateTime.ToDateTimeOrDefault(tungay);
                DateTime? fromDate = ExtendedDateTime.ToDateTimeOrDefault(denngay);
                res = _historyService.GetListHistory(user, 0, toDate, fromDate, msmay, ttphutung, mabp, mapt, pageIndex, pageSize);
                result = new PagedList<HistoryViewModel>(res, res.Count, pageIndex, pageSize);
            }
            else
            {
                if (keySeach != null)
                {
                    result = new PagedList<HistoryViewModel>(res.Where(x => x.MA_BP.Contains(keySeach)).ToList(), res.Count(x => x.MA_BP.Contains(keySeach)), pageIndex, pageSize);
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
