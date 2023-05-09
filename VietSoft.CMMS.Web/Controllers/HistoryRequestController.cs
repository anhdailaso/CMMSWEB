using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
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
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        public IActionResult HistoryRequestIndex()
        {
            ViewBag.ListMAY = _combobox.GetCbbMay("-1", -1, SessionManager.CurrentUser.UserName, SessionManager.CurrentUser.TypeLangue, 1);
            ViewBag.ListNYC = _combobox.GetCbbNYC(SessionManager.CurrentUser.UserName, SessionManager.CurrentUser.TypeLangue, 1);
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
                res = _historyRequestService.GetListHistoryRequest(user, SessionManager.CurrentUser.TypeLangue, toDate, fromDate, msmay, nguoiyc);
                result = new PagedList<HistoryRequestViewModel>(res, res.Count, pageIndex, pageSize);
            }
            else
            {
                if (keySeach != null)
                {
                    result = new PagedList<HistoryRequestViewModel>(res.Where(x => x.MS_MAY.ToLower().Contains(keySeach.ToLower()) || x.TINH_TRANG_MAY.ToLower().Contains(keySeach.ToLower()) || x.NGAY_YC.ToLower().Contains(keySeach.ToLower()) || x.TINH_TRANG_MAY.ToLower().Contains(keySeach.ToLower())).ToList(), res.Count(x => x.MS_MAY.ToLower().Contains(keySeach.ToLower()) || x.TINH_TRANG_MAY.ToLower().Contains(keySeach.ToLower()) || x.NGAY_YC.ToLower().Contains(keySeach.ToLower()) || x.TINH_TRANG_MAY.ToLower().Contains(keySeach.ToLower())), pageIndex, pageSize);
                }
                else
                {
                    result = new PagedList<HistoryRequestViewModel>(res, res.Count, pageIndex, pageSize);
                }
            }

            return PartialView("_historyRequestDetail", result);
        }

        public IActionResult ViewChiTietPBT(string mspbt)
        {
            var res = _historyRequestService.ViewChiTietPBT(SessionManager.CurrentUser.UserName,SessionManager.CurrentUser.TypeLangue,mspbt);
            return PartialView("_viewPhieuBaoTri",res);
        }
    }
}
