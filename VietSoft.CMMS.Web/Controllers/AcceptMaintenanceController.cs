using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using VietSoft.CMMS.Core.Models;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Models;
using VietSoft.CMMS.Web.Resources;
using static Microsoft.Extensions.Logging.EventSource.LoggingEventSource;

namespace VietSoft.CMMS.Web.Controllers
{

    public class AcceptMaintenanceController : BaseController
    {
        private readonly ILogger<AcceptMaintenanceController> _logger;
        private readonly IAccountService _accountService;
        private readonly IComboboxService _combobox;
        private readonly IMaintenanceService _maintenance;


        public AcceptMaintenanceController(ILogger<AcceptMaintenanceController> logger, IAccountService accountService, IComboboxService combobox, IMaintenanceService maintenance)
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
        public IActionResult GetListAcceptMaintenance(string keySeach, int pageIndex, int pageSize, string tungay, string denngay)
        {
            PagedList<AcceptMaintenanceViewModel>? resulst = null;
            var user = SessionManager.CurrentUser.UserName;
            DateTime? toDate = DateTime.ParseExact(tungay, "dd/MM/yyyy", CultureInfo.InvariantCulture);
            DateTime? fromDate = DateTime.ParseExact(denngay, "dd/MM/yyyy", CultureInfo.InvariantCulture);
            List<AcceptMaintenanceModel> model = _maintenance.GetListAcceptMaintenance(user, 0, toDate, fromDate);

            List<AcceptMaintenanceViewModel> res = new List<AcceptMaintenanceViewModel>();
            foreach (var modelItem in model)
            {
                if(res.Count(x=>x.MS_PHIEU_BAO_TRI.Equals(modelItem.MS_PHIEU_BAO_TRI)) == 0)
                {
                    AcceptMaintenanceViewModel item = new AcceptMaintenanceViewModel();
                    item.MS_PHIEU_BAO_TRI = modelItem.MS_PHIEU_BAO_TRI;
                    item.MS_MAY = modelItem.MS_MAY;
                    item.TEN_MAY = modelItem.TEN_MAY;
                    item.NGAY_HOAN_THANH = modelItem.NGAY_HOAN_THANH;
                    item.TEN_LOAI_BT = modelItem.TEN_LOAI_BT;
                    item.JobViewModel = model.Where(x => x.MS_PHIEU_BAO_TRI.Equals(modelItem.MS_PHIEU_BAO_TRI)).Select(m => new JobViewModel
                    {
                        MS_PHIEU_BAO_TRI = m.MS_PHIEU_BAO_TRI,
                        MS_MAY = m.MS_MAY,
                        MS_CV= m.MS_CV,
                        MO_TA_CV= m.MO_TA_CV,
                        MS_BO_PHAN = m.MS_BO_PHAN,
                        TEN_BO_PHAN = m.TEN_BO_PHAN
                    }).DistinctBy(x=>x.MS_CV).ToList();

                    item.SParePartViewModel = model.Where(x => x.MS_PHIEU_BAO_TRI.Equals(modelItem.MS_PHIEU_BAO_TRI)).Select(m => new SParePartViewModel
                    {
                        MS_PHIEU_BAO_TRI = m.MS_PHIEU_BAO_TRI,
                        MS_MAY = m.MS_MAY,
                        MS_BO_PHAN = m.MS_BO_PHAN,
                        MS_CV = m.MS_CV,
                        MS_PT = m.MS_PT,
                        TEN_PT=m.TEN_PT,
                        SL_TT =m.SL_TT,
                    }).Distinct().ToList();
                    res.Add(item);
                }
            }
            if (keySeach != null)
            {
                resulst = new PagedList<AcceptMaintenanceViewModel>(res.Where(x=>x.MS_MAY.Equals(keySeach) || x.MS_PHIEU_BAO_TRI.Equals(keySeach) ||x.NGAY_HOAN_THANH.Equals(keySeach)|| x.TEN_LOAI_BT.Equals(keySeach)).ToList(), res.Count, pageIndex, pageSize);
            }
            else
            {
                resulst = new PagedList<AcceptMaintenanceViewModel>(res, res.Count, pageIndex, pageSize);
            }
            return PartialView("_acceptDetail", resulst);
        }
        [HttpPost]
        public ActionResult SaveAcceptMaintenance(string mspbt)
        {
            //List<MonitoringParametersByDevice> lstParameter = Newtonsoft.Json.JsonConvert.DeserializeObject<List<MonitoringParametersByDevice>>(data);
            BaseResponseModel? res = _maintenance.SaveAcceptMaintenance(SessionManager.CurrentUser.UserName,mspbt);
            if (res.MA == 1)
            {
                return Json(new JsonResponseViewModel { ResponseCode = 1, ResponseMessage = Message.CAPNHAT_THANHCONG });
            }
            else
            {
                return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = res.NAME });
            }
        }
    }
}
