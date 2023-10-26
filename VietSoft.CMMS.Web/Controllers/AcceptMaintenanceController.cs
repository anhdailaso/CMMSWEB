using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Globalization;
using VietSoft.CMMS.Core.Models;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Models;
using VietSoft.CMMS.Web.Models.Maintenance;
using VietSoft.CMMS.Web.Resources;
using VietSoft.CMMS.Web.Services;
using static iTextSharp.text.pdf.AcroFields;
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
            List<AcceptMaintenanceModel> model = _maintenance.GetListAcceptMaintenance(user, 0, toDate, fromDate, SessionManager.CurrentUser.TypeLangue);

            List<AcceptMaintenanceViewModel> res = new List<AcceptMaintenanceViewModel>();
            foreach (var modelItem in model)
            {
                if (res.Count(x => x.MS_PHIEU_BAO_TRI.Equals(modelItem.MS_PHIEU_BAO_TRI)) == 0)
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
                        MS_CV = m.MS_CV,
                        MO_TA_CV = m.MO_TA_CV,
                        MS_BO_PHAN = m.MS_BO_PHAN,
                        TEN_BO_PHAN = m.TEN_BO_PHAN
                    }).DistinctBy(x => x.MS_CV).ToList();

                    item.SParePartViewModel = model.Where(x => x.MS_PHIEU_BAO_TRI.Equals(modelItem.MS_PHIEU_BAO_TRI)).Select(m => new SParePartViewModel
                    {
                        MS_PHIEU_BAO_TRI = m.MS_PHIEU_BAO_TRI,
                        MS_MAY = m.MS_MAY,
                        MS_BO_PHAN = m.MS_BO_PHAN,
                        MS_CV = m.MS_CV,
                        MS_PT = m.MS_PT,
                        TEN_PT = m.TEN_PT,
                        SL_TT = m.SL_TT,
                    }).Distinct().ToList();
                    res.Add(item);
                }
            }
            if (keySeach != null)
            {
                resulst = new PagedList<AcceptMaintenanceViewModel>(res.Where(x => x.MS_MAY.Equals(keySeach) || x.MS_PHIEU_BAO_TRI.Equals(keySeach) || x.NGAY_HOAN_THANH.Equals(keySeach) || x.TEN_LOAI_BT.Equals(keySeach)).ToList(), res.Count, pageIndex, pageSize);
            }
            else
            {
                resulst = new PagedList<AcceptMaintenanceViewModel>(res, res.Count, pageIndex, pageSize);
            }
            
            return PartialView("_acceptDetail", resulst);
        }

        public ActionResult ShowConfirmAccept(string mspbt, string msmay)
        {
            AcceptWorkOrderModel model = new AcceptWorkOrderModel();
            model.MS_PHIEU_BAO_TRI = mspbt;
            model.MS_MAY = msmay;
            model.TT_SAU_BT = "";
            model.lstNoAccepWorkOrderMode = _maintenance.GetListPhieuBaoTriKhongChapNhan(mspbt);
            return PartialView("_ConfirmAccept", model);
        }

        public IActionResult GetListThoiGianNgungMay(string mspbt,string msmay)
        {
            List<ThoiGianNgungMayModel> result = new List<ThoiGianNgungMayModel>();
            result = _maintenance.GetListThoiGianNgungMay(mspbt, SessionManager.CurrentUser.TypeLangue);
            ViewBag.NguyenNhan = _combobox.DanhSachNguyenNhan(msmay,false,SessionManager.CurrentUser.TypeLangue);
            return PartialView("_dataNgungMay", result);
        }


        public IActionResult RefreshThoiGianNgungMay(string tungay, string denngay, int msnn,string msmay)
        {
            DateTime TN = DateTime.ParseExact(tungay, "dd/MM/yyyy HH:mm", CultureInfo.InvariantCulture);
            DateTime DN = DateTime.ParseExact(denngay, "dd/MM/yyyy HH:mm", CultureInfo.InvariantCulture);
            if (TN > DN)
            {
                return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = Message.MESS_TN_KHONG_LON_HON_DN });
            }
            var cboCa = _combobox.DanhSachCa(SessionManager.CurrentUser.TypeLangue);
            List<CapNhatCa> listca = _maintenance.CapNhatCa(TN, DN);
            List<ThoiGianNgungMayModel> result = new List<ThoiGianNgungMayModel>();
            foreach (var item in listca)
            {
                ThoiGianNgungMayModel nm = new ThoiGianNgungMayModel();
                nm.ID_CA = item.ID_CA;
                nm.TEN_CA = cboCa.Where(x => x.Value.ToString().Equals(item.ID_CA.ToString())).Select(x => x.Text).FirstOrDefault().ToString();
                nm.TU_GIO = item.NGAY_BD;
                nm.DEN_GIO = item.NGAY_KT;
                nm.MS_NGUYEN_NHAN = msnn;
                result.Add(nm);
            }
            ViewBag.NguyenNhan = _combobox.DanhSachNguyenNhan(msmay, false, SessionManager.CurrentUser.TypeLangue);
            return PartialView("_dataNgungMay", result);
        }

        public IActionResult AddThoiGianNgungMay(string tungay, string denngay, int msnn,string msmay, string json)
        {
            DateTime TN = DateTime.ParseExact(tungay, "dd/MM/yyyy HH:mm", CultureInfo.InvariantCulture);
            DateTime DN = DateTime.ParseExact(denngay, "dd/MM/yyyy HH:mm", CultureInfo.InvariantCulture);
            //kiểm tra từ ngày không lớn hơn đến ngày
            if(TN > DN)
            {
                return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = Message.MESS_TN_KHONG_LON_HON_DN});
            }    
            List<ThoiGianNgungMayModel> lstParameter = Newtonsoft.Json.JsonConvert.DeserializeObject<List<ThoiGianNgungMayModel>>(json, new JsonSerializerSettings
            {
                DateTimeZoneHandling = DateTimeZoneHandling.Local,
                DateFormatString = "dd/MM/yyyy HH:mm:ss"
            });
            //kiểm tra từ ngày và đến ngày không nằm trong khoản list lstParameter
            //int n = lstParameter.Count(x => x.TU_GIO < TN && x.DEN_GIO > TN);
            //int n1 = lstParameter.Count(x => x.TU_GIO < DN && x.DEN_GIO > DN);
            //int n2 = lstParameter.Count(x => x.TU_GIO > TN && x.DEN_GIO < DN);
            //if(n + n1 + n2 > 0)
            //{
            //    return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = Message.MESS_KHOAN_TG_TON_TAI });
            //}    
            var timeList = new List<Tuple<DateTime, DateTime>>();
            timeList.Add(Tuple.Create(TN, DN));
            foreach (var logWorkViewModel in lstParameter.OrderBy(x => x.TU_GIO).ToList())
            {
                timeList.Add(Tuple.Create(logWorkViewModel.TU_GIO, logWorkViewModel.DEN_GIO));
            }
            if (Commons.CheckTimeOverlap(timeList))
            {
                return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = Message.MESS_KHOAN_TG_TON_TAI });
            }
            var cboCa = _combobox.DanhSachCa(SessionManager.CurrentUser.TypeLangue);
            List<CapNhatCa> listca = _maintenance.CapNhatCa(TN, DN);
            List<ThoiGianNgungMayModel> result = new List<ThoiGianNgungMayModel>();
            foreach (var item in listca)
            {
                ThoiGianNgungMayModel nm = new ThoiGianNgungMayModel();
                nm.ID_CA = item.ID_CA;
                //nm.TEN_CA = cboCa.Where(x => x.Value.ToString().Equals(item.ID_CA.ToString())).Select(x => x.Text).FirstOrDefault().ToString();
                nm.TU_GIO = item.NGAY_BD;
                nm.DEN_GIO = item.NGAY_KT;
                nm.MS_NGUYEN_NHAN = msnn;
                result.Add(nm);
            }
            result.AddRange(lstParameter);
            foreach (var item in result)
            {
                item.TEN_CA = cboCa.Where(x => x.Value.ToString().Equals(item.ID_CA.ToString())).Select(x => x.Text).FirstOrDefault().ToString();
            }
            ViewBag.NguyenNhan = _combobox.DanhSachNguyenNhan(msmay, false, SessionManager.CurrentUser.TypeLangue);
            return PartialView("_dataNgungMay", result.OrderBy(x=>x.TU_GIO));
        }

        public IActionResult SaveThoiGianNgungMay(string mspbt, string json)
        {
            List<ThoiGianNgungMayModel> lstParameter = Newtonsoft.Json.JsonConvert.DeserializeObject<List<ThoiGianNgungMayModel>>(json, new JsonSerializerSettings
            {
                DateTimeZoneHandling = DateTimeZoneHandling.Local,
                DateFormatString = "dd/MM/yyyy HH:mm:ss"
            });

            JsonSerializerSettings formatSettings = new JsonSerializerSettings
            {
                DateFormatString = "MM/dd/yyyy HH:mm:ss"
            };

            BaseResponseModel? res = _maintenance.SaveThoiGianNgungMay(SessionManager.CurrentUser.UserName, mspbt, Newtonsoft.Json.JsonConvert.SerializeObject(lstParameter,formatSettings));
            if (res.MA == 1)
            {
                return Json(new JsonResponseViewModel { ResponseCode = 1, ResponseMessage = Message.CAPNHAT_THANHCONG });
            }
            else
            {
                return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = Message.COLOI_XAYRA });
            }
        }


        public IActionResult ViewThoiGianNgungMay(string mspbt,string msmay)
        {
            ViewBag.MS_PBT = mspbt;
            ViewBag.MS_MAY = msmay;
            ViewBag.NguyenNhan = _combobox.DanhSachNguyenNhan(msmay, false, SessionManager.CurrentUser.TypeLangue).Where(x=>x.Text.Trim()!="");
            var res = _maintenance.GetThoiGianNgungMay(mspbt, SessionManager.CurrentUser.UserName, SessionManager.CurrentUser.TypeLangue, false);
            return PartialView("_viewNgungMay", res);
        }
        [HttpPost]
        public ActionResult SaveAcceptMaintenance(AcceptWorkOrderModel data)
        {
            //List<MonitoringParametersByDevice> lstParameter = Newtonsoft.Json.JsonConvert.DeserializeObject<List<MonitoringParametersByDevice>>(data);
            BaseResponseModel? res = _maintenance.SaveAcceptMaintenance(SessionManager.CurrentUser.UserName, data, SessionManager.CurrentUser.TypeLangue);
            if (res.MA == 1)
            {
                return Json(new JsonResponseViewModel { ResponseCode = 1, ResponseMessage = Message.CAPNHAT_THANHCONG });
            }
            else
            {
                return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = res.NAME });
            }
        }


        [HttpPost]
        public ActionResult NoAcceptMaintenance(AcceptWorkOrderModel data)
        {
            //List<MonitoringParametersByDevice> lstParameter = Newtonsoft.Json.JsonConvert.DeserializeObject<List<MonitoringParametersByDevice>>(data);
            BaseResponseModel? res = _maintenance.NoAcceptMaintenance(SessionManager.CurrentUser.UserName, data, SessionManager.CurrentUser.TypeLangue);
            if (res.MA == 1)
            {
                return Json(new JsonResponseViewModel { ResponseCode = 1, ResponseMessage = Message.CAPNHAT_THANHCONG });
            }
            else
            {
                return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = res.NAME });
            }
        }


        public IActionResult ShowKhongDuyetPBT(string sophieu)
        {
            List<NoAcceptWorkOrderModel>? result = null;
            result = _maintenance.GetListPhieuBaoTriKhongChapNhan(sophieu);
            return PartialView("_listKhongNghiemThu", result);
        }

    }
}
