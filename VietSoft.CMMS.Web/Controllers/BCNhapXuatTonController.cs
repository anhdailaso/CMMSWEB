using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Diagnostics;
using System.Globalization;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Models;

namespace VietSoft.CMMS.Web.Controllers
{

    public class BCNhapXuatTonController : BaseController
    {
        private readonly ILogger<BCNhapXuatTonController> _logger;
        private readonly IAccountService _accountService;
        private readonly IComboboxService _combobox;
        private readonly IDeviceService _device;
        private readonly IGoodIssueService _goodissue;

        public BCNhapXuatTonController(ILogger<BCNhapXuatTonController> logger, IAccountService accountService, IComboboxService combobox, IDeviceService device, IGoodIssueService goodissue)
        {
            _logger = logger;
            _accountService = accountService;
            _combobox = combobox;
            _device = device;
            _goodissue = goodissue;
        }

        [AllowAnonymous]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public IActionResult Index()
        {
            ViewBag.ListKho = _combobox.DanhSachKho(SessionManager.CurrentUser.UserName);
            ViewBag.ListPhuTung = _combobox.DanhSachPhuTung(SessionManager.CurrentUser.TypeLangue);

            return View();
        }

        public IActionResult GetBaoCaoNhapXuatTon(string tungay, string denngay, string mspt, int mskho)
        {
            //dạng nhập
          
            var ListBaoCao = _goodissue.GetBaoCaoNhapXuatTon(SessionManager.CurrentUser.UserName,SessionManager.CurrentUser.TypeLangue, DateTime.ParseExact(tungay, "dd/MM/yyyy", CultureInfo.InvariantCulture), DateTime.ParseExact(denngay, "dd/MM/yyyy", CultureInfo.InvariantCulture), mskho, mspt);
            return PartialView("_Detail", ListBaoCao);
        }

    }
}
