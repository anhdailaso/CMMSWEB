using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Globalization;
using VietSoft.CMMS.Core.Models;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Models;
using VietSoft.CMMS.Web.Resources;
using VietSoft.CMMS.Web.Services;

namespace VietSoft.CMMS.Web.Controllers
{

    public class GoodReceiptController : BaseController
    {
        private readonly ILogger<GoodReceiptController> _logger;
        private readonly IAccountService _accountService;
        private readonly IComboboxService _combobox;
        private readonly IDeviceService _device;
        private readonly IGoodReceiptService _goodreceipt;

        public GoodReceiptController(ILogger<GoodReceiptController> logger, IAccountService accountService, IComboboxService combobox, IDeviceService device, IGoodReceiptService goodreceipt)
        {
            _logger = logger;
            _accountService = accountService;
            _combobox = combobox;
            _device = device;
            _goodreceipt = goodreceipt;
        }

        [AllowAnonymous]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public IActionResult Index()
        {
            res = null;
            ViewBag.ListKho = _combobox.DanhSachKho(SessionManager.CurrentUser.UserName);
            return View();
        }

        public IActionResult AddPhieuNhap(string msp, string mskho)
        {
            ViewBag.ListKho = _combobox.DanhSachKho(SessionManager.CurrentUser.UserName);
            return View("~/Views/ GoodReceipt/AddphieuNhap.cshtml");

        }

        //keyword: $('#search').val(),
        //        pageIndex: pageIndex ?? 1,
        //        pageSize: config.PAGE_SIZE,
        //        reset: reset,
        //        mskho: $('#cbokho').val(),
        //        tungay: $('#fromDate').val(),
        //        denngay: $('#toDate').val(),
        public static List<GoodReceiptViewModel>? res;
        public IActionResult GetListGoodReceipt(string keyword, int pageIndex, int pageSize, string mskho, string tungay, string denngay)
        {
            PagedList<GoodReceiptViewModel>? result = null;
            if (pageIndex == 1 && keyword == null)
            {
                res = _goodreceipt.GetListGoodReceipt(SessionManager.CurrentUser.UserName, 0, DateTime.ParseExact(tungay, "dd/MM/yyyy", CultureInfo.InvariantCulture), DateTime.ParseExact(denngay, "dd/MM/yyyy", CultureInfo.InvariantCulture), mskho);
                result = new PagedList<GoodReceiptViewModel>(res, res.Count, pageIndex, pageSize);
            }
            else
            {

                if (keyword != null)
                {
                    result = new PagedList<GoodReceiptViewModel>(res.Where(x => x.MS_DH_NHAP_PT.ToLower().Contains(keyword.ToLower())).ToList(), res.Count(x => x.MS_DH_NHAP_PT.ToLower().Contains(keyword.ToLower())), pageIndex, pageSize);
                }
                else
                {
                    result = new PagedList<GoodReceiptViewModel>(res, res.Count, pageIndex, pageSize);
                }
            }

            return PartialView("_goodreceiptDetail", result);
        }

    }
}
