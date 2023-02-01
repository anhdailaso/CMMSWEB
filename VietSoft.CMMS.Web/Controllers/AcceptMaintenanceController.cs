using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Models;

namespace VietSoft.CMMS.Web.Controllers
{

    public class AcceptMaintenanceController : BaseController
    {
        private readonly ILogger<AcceptMaintenanceController> _logger;
        private readonly IAccountService _accountService;
        private readonly IComboboxService _combobox;
        private readonly IMaintenanceService _maintenance;


        public AcceptMaintenanceController(ILogger<AcceptMaintenanceController> logger, IAccountService accountService, IComboboxService combobox,IMaintenanceService maintenance)
        {
            _logger = logger;
            _accountService = accountService;
            _combobox = combobox;
            _maintenance = maintenance;
        }

        [AllowAnonymous]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Index()
        {
            return View();
        }

        public static List<AcceptMaintenanceViewModel>? res;
        public IActionResult GetListAcceptMaintenance(string keySeach, int pageIndex, int pageSize, string tungay, string denngay)
        {
            PagedList<AcceptMaintenanceViewModel>? result = null;
            var user = SessionManager.CurrentUser.UserName;
            if (pageIndex == 1 && keySeach == null)
            {
                DateTime? toDate = ExtendedDateTime.ToDateTimeOrDefault(tungay);
                DateTime? fromDate = ExtendedDateTime.ToDateTimeOrDefault(denngay);
                res = _maintenance.GetListAcceptMaintenance(user, 0, toDate, fromDate);
                result = new PagedList<AcceptMaintenanceViewModel>(res, res.Count, pageIndex, pageSize);
            }
            else
            {
                if (keySeach != null)
                {
                    result = new PagedList<AcceptMaintenanceViewModel>(res.Where(x => x.MA_BP.Contains(keySeach)).ToList(), res.Count(x => x.MA_BP.Contains(keySeach)), pageIndex, pageSize);
                }
                else
                {
                    result = new PagedList<AcceptMaintenanceViewModel>(res, res.Count, pageIndex, pageSize);
                }
            }

            return PartialView("_acceptDetail", result);
        }


    }
}
