using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Diagnostics;
using System.Globalization;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Models;
using VietSoft.CMMS.Web.Models.Maintenance;
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

        public IActionResult AddGoodReceipt(string mspn, int mskho)
        {
            //dạng nhập
            ViewBag.DangNhap = _combobox.GetCbbDangNhap(SessionManager.CurrentUser.UserName,0,0);
            //đơn hàng
            ViewBag.DDH = _combobox.GetCbbTrong();
            //người nhập
            ViewBag.NguoiNhap = _combobox.GetCbbTrong();

            var ListGoodReceiptDetails = _goodreceipt.GetGoodReceiptDetails(SessionManager.CurrentUser.UserName,0,mspn,mskho);
            ListGoodReceiptDetails.QUYEN = true;
            return View("~/Views/GoodReceipt/AddGoodReceipt.cshtml", ListGoodReceiptDetails);
        }

        public IActionResult EditGoodReceipt(string mspn)
        {
            var ListGoodReceiptDetails = _goodreceipt.GetGoodReceiptDetails(SessionManager.CurrentUser.UserName, 0, mspn, -1);
            //dạng nhập
            ViewBag.DangNhap = _combobox.GetCbbDangNhap(SessionManager.CurrentUser.UserName, 0, 0);
            //người nhập
            ViewBag.NguoiNhap = _combobox.GetCbbNguoiNhap(SessionManager.CurrentUser.UserName, 0, 0, -1, -1);

            if(ListGoodReceiptDetails.THEM == true || (SessionManager.CurrentUser.UserName.ToLower() == ListGoodReceiptDetails.USER_LAP && ListGoodReceiptDetails.LOCK == false))
            {
                ListGoodReceiptDetails.QUYEN = true;
            }    
            else
            {
                ListGoodReceiptDetails.QUYEN = false;
            }    
            return View("~/Views/GoodReceipt/AddGoodReceipt.cshtml", ListGoodReceiptDetails);
        }

        public ActionResult getDonHang(int coall, int dexuat)
        {
            SelectList lst = _combobox.GetCbbDDH(SessionManager.CurrentUser.UserName, 0,0, dexuat);
            return Json(lst);
        }

        public ActionResult getNguoiNhap(int khachhang, int vaitro)
        {
            SelectList lst = _combobox.GetCbbNguoiNhap(SessionManager.CurrentUser.UserName, 0, 0,khachhang, vaitro);
            return Json(lst);
        }

    
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


        public IActionResult GetDSPhuTungNhap(string mspn, int khoa)
        {
            List<DanhSachPhuTungNhapKhoModel>? result = null;
            result = _goodreceipt.GetListPhuTungNhap(SessionManager.CurrentUser.UserName,0,mspn);
            return PartialView("_listPhuTungNhap", result);
        }

        public IActionResult ChonDSPhuTungNhap()
        {
            return PartialView("_viewPhuTung");
        }

        public IActionResult LoadDSPhuTungNhap(string keyword, string mspn)
        {
            List<PhuTungModel> res = new List<PhuTungModel>();
            try
            {
                if (keyword == null || keyword == "")
                {
                    res = _goodreceipt.GetListChonPhuTungNhap(SessionManager.CurrentUser.UserName, 0, mspn);
                }
                else
                {
                    res = _goodreceipt.GetListChonPhuTungNhap(SessionManager.CurrentUser.UserName, 0, mspn).Where(x => x.MS_PT.ToLower().Contains(keyword.ToLower()) || x.TEN_PT.ToLower().Contains(keyword.ToLower())).ToList();
                }
            }
            catch
            {
                res = new List<PhuTungModel>();
            } 
            return PartialView("_chonPhuTung", res);
        }

        public IActionResult GetPhieuNhapKhoChiPhi(string mspn)
        {
             ViewBag.DANGPB = _combobox.DangPhanBo();
            List<PhieuNhapKhoChiPhiModel> result = new List<PhieuNhapKhoChiPhiModel>() ;
            result = _goodreceipt.GetCHiPhiPhieuNhapKho(0, mspn,2);
            return PartialView("_viewChiPhi",result);
        }

        public IActionResult GetPhieuNhapKhoPhuTungDetails(string mspn, string mspt)
        {
           PhieuNhapKhoPhuTungMore result = new PhieuNhapKhoPhuTungMore();
            result = _goodreceipt.GetPhieuNhapKhoPhuTungMore(SessionManager.CurrentUser.UserName, 0, mspn, mspt);
            return PartialView("_viewPhuTungDetail", result);
        }

        public IActionResult GetPhieuNhapKhoViTri(string mspn,string mspt)
        {
            List<ViTriNhapKhoModel> result = new List<ViTriNhapKhoModel>();
            result = _goodreceipt.GetViTriNhapKho(SessionManager.CurrentUser.UserName,0,mspn, mspt);
            return PartialView("_viewViTri", result);
        }

        public IActionResult DeletePhieuNhapKho(string mspn)
        {
            var res = _goodreceipt.DeletePhieuNhapKho(mspn, SessionManager.CurrentUser.UserName);
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
