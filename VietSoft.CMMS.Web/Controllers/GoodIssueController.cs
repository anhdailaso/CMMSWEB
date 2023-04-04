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

    public class GoodIssueController : BaseController
    {
        private readonly ILogger<GoodIssueController> _logger;
        private readonly IAccountService _accountService;
        private readonly IComboboxService _combobox;
        private readonly IDeviceService _device;
        private readonly IGoodIssueService _goodissue;

        public GoodIssueController(ILogger<GoodIssueController> logger, IAccountService accountService, IComboboxService combobox, IDeviceService device, IGoodIssueService goodissue)
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
            res = null;
            ViewBag.ListKho = _combobox.DanhSachKho(SessionManager.CurrentUser.UserName);
            return View();
        }
        public IActionResult AddGoodIssue(string mspx, int mskho)
        {


            //dạng nhập
            ViewBag.DangXuat = _combobox.GetCbbDangxuat(SessionManager.CurrentUser.UserName, 0, 0);
            ViewBag.PBT = _combobox.GetCbbTrong();
            ViewBag.BPCP = _combobox.GetCbbTrong();
            ViewBag.NguoiNhap = _combobox.GetCbbTrong();
            var ListGoodRIssueDetails = _goodissue.GetGoodIssueDetails(SessionManager.CurrentUser.UserName, 0, mspx, mskho);
            ListGoodRIssueDetails.QUYEN = true;
            ListGoodRIssueDetails.SO_PHIEU_XN = ListGoodRIssueDetails.MS_DH_XUAT_PT;
            return View("~/Views/GoodIssue/AddGoodIssue.cshtml", ListGoodRIssueDetails);
        }

        public IActionResult EditGoodIssue(string mspx)
        {
            var ListGoodReceiptDetails = _goodissue.GetGoodIssueDetails(SessionManager.CurrentUser.UserName, 0, mspx, -1);
            //dạng nhập
            ViewBag.DangXuat = _combobox.GetCbbDangxuat(SessionManager.CurrentUser.UserName, 0, 0);
            //người nhập
            ViewBag.NguoiNhap = _combobox.GetCbbNguoiXuat(SessionManager.CurrentUser.UserName, 0, 0, -1, -1);

            if (ListGoodReceiptDetails.THEM == true || (SessionManager.CurrentUser.UserName.ToLower() == ListGoodReceiptDetails.USER_LAP && ListGoodReceiptDetails.LOCK == false))
            {
                ListGoodReceiptDetails.QUYEN = true;
            }
            else
            {
                ListGoodReceiptDetails.QUYEN = false;
            }
            return View("~/Views/GoodIssue/AddGoodIssue.cshtml", ListGoodReceiptDetails);
        }

        public ActionResult getPhieuBaoTri()
        {
            SelectList lst = _combobox.GetCbbPhieuBaoTriXuat();
            return Json(lst);
        }

        public ActionResult getMaybyPhieuBaoTri(string mspbt)
        {
            string may = _goodissue.GetMaybyPhieuBaoTri(mspbt);
            return Json(may);
        }

        public ActionResult getBoPhanChieuPhi()
        {
            SelectList lst = _combobox.GetCbbBoPhanChiuPhi(SessionManager.CurrentUser.UserName);
            return Json(lst);
        }


        public ActionResult getNguoiNhap(int khachhang, int vaitro)
        {
            SelectList lst = _combobox.GetCbbNguoiXuat(SessionManager.CurrentUser.UserName, 0, 0, khachhang, vaitro);
            return Json(lst);
        }


        public static List<GoodIssueViewModel>? res;
        public IActionResult GetListGoodIssue(string keyword, int pageIndex, int pageSize, string mskho, string tungay, string denngay)
        {
            PagedList<GoodIssueViewModel>? result = null;
            if (pageIndex == 1 && keyword == null)
            {
                res = _goodissue.GetListGoodIssue(SessionManager.CurrentUser.UserName, 0, DateTime.ParseExact(tungay, "dd/MM/yyyy", CultureInfo.InvariantCulture), DateTime.ParseExact(denngay, "dd/MM/yyyy", CultureInfo.InvariantCulture), mskho);
                result = new PagedList<GoodIssueViewModel>(res, res.Count, pageIndex, pageSize);
            }
            else
            {

                if (keyword != null)
                {
                    result = new PagedList<GoodIssueViewModel>(res.Where(x => x.SO_PHIEU_XN.ToLower().Contains(keyword.ToLower())).ToList(), res.Count(x => x.SO_PHIEU_XN.ToLower().Contains(keyword.ToLower())), pageIndex, pageSize);
                }
                else
                {
                    result = new PagedList<GoodIssueViewModel>(res, res.Count, pageIndex, pageSize);
                }
            }

            return PartialView("_goodissueDetail", result);
        }

        public IActionResult GetDSPhuTungXuat(string mspx)
        {
            List<DanhSachPhuTungXuatKhoModel>? result = null;
            result = _goodissue.GetListPhuTungXuat(SessionManager.CurrentUser.UserName, 0, mspx);
            return PartialView("_listPhuTungXuat", result);
        }

        public IActionResult ChonDSPhuTungXuat(int dangxuat)
        {
            ViewBag.DangXuat = dangxuat;
            return PartialView("_viewPhuTungXuat");
        }

        public IActionResult LoadDSPhuTungXuat(bool theoBT, string mspx)
        {
            List<ChonDanhSachPhuTungXuatModel> res = new List<ChonDanhSachPhuTungXuatModel>();
            try
            {
                res = _goodissue.GetListChonPhuTungXuat(theoBT, SessionManager.CurrentUser.UserName, 0, mspx);
            }
            catch
            {
                res = new List<ChonDanhSachPhuTungXuatModel>();
            }
            return PartialView("_chonPhuTungXuat", res);
        }

    }
}
