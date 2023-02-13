using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Models;
using VietSoft.CMMS.Web.Services;

namespace VietSoft.CMMS.Web.Controllers
{
    public class HistoryRequestController : BaseController
    {
        private readonly ILogger<HistoryRequestController> _logger;
        private readonly IAccountService _accountService;
        private readonly IComboboxService _combobox;
        private readonly IHistoryRequestService _historyRequestService;


        public HistoryRequestController(ILogger<HistoryRequestController> logger, IAccountService accountService, IComboboxService combobox, IHistoryRequestService historyRequestService)
        {
            _logger = logger;
            _accountService = accountService;
            _combobox = combobox;
            _historyRequestService = historyRequestService;
        }

        [AllowAnonymous]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult HistoryRequestIndex()
        {
            ViewBag.ListMAY = _combobox.GetCbbMay("-1", -1, SessionManager.CurrentUser.UserName, 0, 1);
            ViewBag.ListNYC = _combobox.GetCbbNYC(SessionManager.CurrentUser.UserName, 0, 1);
            return View();
        }

        public static List<HistoryRequestViewModel>? res;
        public IActionResult GetListHistoryRequest(string keySeach, int pageIndex, int pageSize, string msmay, string tungay, string denngay, string nguoiyc)
        {
            PagedList<HistoryRequestViewModel>? result = null;
            var user = SessionManager.CurrentUser.UserName;
            if (pageIndex == 1 && keySeach == null)
            {
                DateTime? toDate = DateTime.ParseExact(tungay, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                DateTime? fromDate = DateTime.ParseExact(denngay, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                res = _historyRequestService.GetListHistoryRequest(user, 0, toDate, fromDate, msmay, nguoiyc);
                result = new PagedList<HistoryRequestViewModel>(res, res.Count, pageIndex, pageSize);
            }
            else
            {
                if (keySeach != null)
                {
                    result = new PagedList<HistoryRequestViewModel>(res.Where(x => x.TINH_TRANG_MAY.Contains(keySeach) || x.NGAY_KT_PBT.Contains(keySeach) || x.TINH_TRANG_MAY.Contains(keySeach)).ToList(), res.Count(x => x.TINH_TRANG_MAY.Contains(keySeach)), pageIndex, pageSize);
                }
                else
                {
                    result = new PagedList<HistoryRequestViewModel>(res, res.Count, pageIndex, pageSize);
                }
            }

            return PartialView("_historyRequestDetail", result);
        }
    }
}
