using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Diagnostics;
using System.Globalization;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Models;
using VietSoft.CMMS.Web.Resources;
using VietSoft.CMMS.Web.Services;

namespace VietSoft.CMMS.Web.Controllers
{

    public class ThoigianChayMayController : BaseController
    {
        private readonly ILogger<ThoigianChayMayController> _logger;
        private readonly IAccountService _accountService;
        private readonly IComboboxService _combobox;
        private readonly IDeviceService _device;
        private readonly IHomeService _homeService;

        public ThoigianChayMayController(ILogger<ThoigianChayMayController> logger, IAccountService accountService, IComboboxService combobox, IDeviceService device, IHomeService homeService)
        {
            _logger = logger;
            _accountService = accountService;
            _combobox = combobox;
            _device = device;
            _homeService = homeService;
        }

        [AllowAnonymous]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public IActionResult Index()
        {
            ViewBag.ListNhaXuong = _combobox.GetCbbDiaDiem(SessionManager.CurrentUser.UserName, SessionManager.CurrentUser.TypeLangue, 1);

            SelectList listMAY = _combobox.GetCbbMay("-1", -1, SessionManager.CurrentUser.UserName, SessionManager.CurrentUser.TypeLangue, 1);
            SelectListItem itemMay = listMAY.Where(x => x.Value.ToString() == "-1").FirstOrDefault();
            itemMay.Text = "";
            ViewBag.ListMAY = listMAY;
            //ViewBag.ListPhuTung = _combobox.DanhSachPhuTung(SessionManager.CurrentUser.TypeLangue);

            return View();
        }

        public static List<ThoiGianChayMayViewModel>? res;

        public IActionResult GetBaoCaoThoigianChayMay(int pageIndex, int pageSize, string tungay, string denngay, string msmay)
        {
            //dạng nhập

            PagedList<ThoiGianChayMayViewModel>? result = null;
            if (pageIndex == 1)
            {
                res = _homeService.GetThoiGianChayMay(SessionManager.CurrentUser.UserName, DateTime.ParseExact(tungay, "dd/MM/yyyy", CultureInfo.InvariantCulture), DateTime.ParseExact(denngay, "dd/MM/yyyy", CultureInfo.InvariantCulture), msmay, SessionManager.CurrentUser.TypeLangue);
                result = new PagedList<ThoiGianChayMayViewModel>(res, res.Count, pageIndex, pageSize);
            }
            else
            {
                result = new PagedList<ThoiGianChayMayViewModel>(res, res.Count(), pageIndex, pageSize);
            }
            return PartialView("_Detail", result);
        }


        public IActionResult DeleteThoigianchaymay(string msmay ,string ngay)
        {
            var res = _homeService.DeleteThoigianchaymay(msmay, DateTime.ParseExact(ngay, "dd/MM/yyyy", CultureInfo.InvariantCulture));
            if (res.MA == 1)
            {
                return Json(new JsonResponseViewModel { ResponseCode = 1, ResponseMessage = Message.CAPNHAT_THANHCONG });
            }
            else
            {
                return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = res.NAME });
            }
        }

        public IActionResult InsertThoigianchaymay(ThoiGianChayMayViewModel model)
        {
            ViewBag.title = "Thêm thời gian chạy máy";
            model.NGAY = DateTime.Now;
            try
            {
                var res = _homeService.GetThoiGianChayMay(SessionManager.CurrentUser.UserName, DateTime.Now.AddMonths(-1), DateTime.Now, model.MS_MAY, SessionManager.CurrentUser.TypeLangue);

                model.SO_GIO_LUY_KE = res.Max(x => x.SO_GIO_LUY_KE);
            }
            catch 
            {
                model.SO_GIO_LUY_KE = 0;
            }
            return PartialView("_addThoiGianChayMay", model);
        }

        public IActionResult EditThoigianchaymay(ThoiGianChayMayViewModel model)
        {
            ViewBag.title = "Sữa thời gian chạy máy";
            model.NGAY = DateTime.ParseExact(model.sNGAY, "dd/MM/yyyy", CultureInfo.InvariantCulture);
            return PartialView("_addThoiGianChayMay", model);
        }

        [HttpPost]
        public IActionResult SaveThoigianchaymay(ThoiGianChayMayViewModel model)
        {
            model.USERNAME = SessionManager.CurrentUser.UserName;
            var res = _homeService.SaveThoigianchaymay(model);
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
