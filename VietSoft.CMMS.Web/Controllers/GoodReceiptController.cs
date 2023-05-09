using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Diagnostics;
using System.Globalization;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Models;
using VietSoft.CMMS.Web.Resources;
using iTextSharp.text;
using iTextSharp.text.pdf;
using Newtonsoft.Json.Linq;
using System.Drawing;
using ZXing;
using ZXing.Common;

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
            ViewBag.DangNhap = _combobox.GetCbbDangNhap(SessionManager.CurrentUser.UserName, SessionManager.CurrentUser.TypeLangue, 0);
            //đơn hàng
            ViewBag.DDH = _combobox.GetCbbTrong();
            //người nhập
            ViewBag.NguoiNhap = _combobox.GetCbbTrong();

            var ListGoodReceiptDetails = _goodreceipt.GetGoodReceiptDetails(SessionManager.CurrentUser.UserName, SessionManager.CurrentUser.TypeLangue, mspn, mskho);
            ListGoodReceiptDetails.QUYEN = true;
            return View("~/Views/GoodReceipt/AddGoodReceipt.cshtml", ListGoodReceiptDetails);
        }

        public IActionResult EditGoodReceipt(string mspn)
        {
            var ListGoodReceiptDetails = _goodreceipt.GetGoodReceiptDetails(SessionManager.CurrentUser.UserName, SessionManager.CurrentUser.TypeLangue, mspn, -1);
            //dạng nhập
            ViewBag.DangNhap = _combobox.GetCbbDangNhap(SessionManager.CurrentUser.UserName, SessionManager.CurrentUser.TypeLangue, 0);
            //người nhập
            ViewBag.NguoiNhap = _combobox.GetCbbNguoiNhap(SessionManager.CurrentUser.UserName, SessionManager.CurrentUser.TypeLangue, 0, -1, -1);

            if (ListGoodReceiptDetails.THEM == true || (SessionManager.CurrentUser.UserName.ToLower() == ListGoodReceiptDetails.USER_LAP.ToLower() && ListGoodReceiptDetails.LOCK == false))
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
            SelectList lst = _combobox.GetCbbDDH(SessionManager.CurrentUser.UserName, SessionManager.CurrentUser.TypeLangue, 0, dexuat);
            return Json(lst);
        }

        public ActionResult getNguoiNhap(int khachhang, int vaitro)
        {
            SelectList lst = _combobox.GetCbbNguoiNhap(SessionManager.CurrentUser.UserName, SessionManager.CurrentUser.TypeLangue, 0, khachhang, vaitro);
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
            ViewBag.NgoaiTe = _combobox.CboNgoaiTe();
            List<DanhSachPhuTungNhapKhoModel>? result = null;
            result = _goodreceipt.GetListPhuTungNhap(SessionManager.CurrentUser.UserName, SessionManager.CurrentUser.TypeLangue, mspn);
            return PartialView("_listPhuTungNhap", result);
        }

        public IActionResult ChonDSPhuTungNhap(string mspn)
        {
            ViewBag.MS_PN = mspn;
            return PartialView("_viewPhuTung");
        }

        public IActionResult InBarCode(string jsonData,string mspn)
        {
            JArray jsonArray = JArray.Parse(jsonData);
            List<string> barcodeValues = new List<string>();
            foreach (JObject jsonObject in jsonArray)
            {
                string msPtValue = mspn + "*" +(string)jsonObject["MS_PT"].ToString();
                barcodeValues.Add(msPtValue);
            }
            return PartialView("_BarCode", barcodeValues);
        }

        public IActionResult LoadDSPhuTungNhap(string mspn)
        {
            List<PhuTungModel> res = new List<PhuTungModel>();
            try
            {
                res = _goodreceipt.GetListChonPhuTungNhap(SessionManager.CurrentUser.UserName, SessionManager.CurrentUser.TypeLangue, mspn);
            }
            catch
            {
                res = new List<PhuTungModel>();
            }
            return PartialView("_chonPhuTung", res);
        }

        public IActionResult GetPhieuNhapKhoChiPhi(string mspn, bool quyen)
        {
            ViewBag.DANGPB = _combobox.DangPhanBo(SessionManager.CurrentUser.TypeLangue);
            ViewBag.QUYEN = quyen;
            ViewBag.MS_PN = mspn;
            List<PhieuNhapKhoChiPhiModel> result = new List<PhieuNhapKhoChiPhiModel>();
            result = _goodreceipt.GetCHiPhiPhieuNhapKho(SessionManager.CurrentUser.TypeLangue, mspn, 2);
            return PartialView("_viewChiPhi", result);
        }

        public IActionResult GetPhieuNhapKhoPhuTungDetails(string mspn, string mspt)
        {
            ViewBag.MS_PN = mspn;
            PhieuNhapKhoPhuTungMore result = new PhieuNhapKhoPhuTungMore();
            result = _goodreceipt.GetPhieuNhapKhoPhuTungMore(SessionManager.CurrentUser.UserName, SessionManager.CurrentUser.TypeLangue, mspn, mspt);
            return PartialView("_viewPhuTungDetail", result);
        }

        public IActionResult GetPhieuNhapKhoViTri(string mspn, string mspt, bool xoa)
        {
            List<ViTriNhapKhoModel> result = new List<ViTriNhapKhoModel>();
            ViewBag.MSPT = mspt;
            ViewBag.XOA = xoa;
            ViewBag.MS_PN = mspn;
            result = _goodreceipt.GetViTriNhapKho(SessionManager.CurrentUser.UserName, SessionManager.CurrentUser.TypeLangue, mspn, mspt);
            return PartialView("_viewViTri", result);
        }

        public IActionResult DeletePhieuNhapKho(string mspn)
        {
            var res = _goodreceipt.DeletePhieuNhapKho(mspn, SessionManager.CurrentUser.UserName, SessionManager.CurrentUser.TypeLangue);
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
        public IActionResult SavePhieuNhapKho(GoodReceiptDetailsModel model)
        {
            ResponseViewModel res = _goodreceipt.SavePhieuNhapKho(model, SessionManager.CurrentUser.UserName);
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
        public IActionResult SaveThongTinPhuTung(PhieuNhapKhoPhuTungMore model)
        {
            ResponseViewModel res = _goodreceipt.SaveThongTinPhuTung(model, SessionManager.CurrentUser.UserName);
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
        public async Task<ActionResult> AddPhuTungNhap(string jsonData, string mspn)
        {
            ResponseViewModel res = _goodreceipt.AddPhuTungNhap(SessionManager.CurrentUser.UserName, jsonData, mspn);
            if (res.MA == 1)
            {
                return Json(new JsonResponseViewModel { ResponseCode = 1, ResponseMessage = Message.CAPNHAT_THANHCONG });
            }
            else
            {
                return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = Message.COLOI_XAYRA });
            }
        }

        [HttpPost]
        public async Task<ActionResult> SaveChiPhi(string jsonData, string mspn)
        {
            ResponseViewModel res = _goodreceipt.SaveChiPhi(SessionManager.CurrentUser.UserName, jsonData, mspn);
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
        public async Task<ActionResult> SaveVitri(string jsonData, string mspn, string mspt)
        {
            ResponseViewModel res = _goodreceipt.SaveVitri(SessionManager.CurrentUser.UserName, jsonData, mspn, mspt, SessionManager.CurrentUser.TypeLangue);
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
        public async Task<ActionResult> SavePhuTungNhap(string jsonData, string mspn)
        {
            ResponseViewModel res = _goodreceipt.SavePhuTungNhap(SessionManager.CurrentUser.UserName, jsonData, mspn, SessionManager.CurrentUser.TypeLangue);
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
        public IActionResult DeletePhuTungNhapKho(string mspt, string mspn)
        {
            var res = _goodreceipt.DeletePhuTungNhapKho(mspt, mspn, SessionManager.CurrentUser.TypeLangue);
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
        public IActionResult LockPhieuNhapKho(string mspn)
        {
            var res = _goodreceipt.LockPhieuNhapKho(mspn);
            if (res.MA == 1)
            {
                return Json(new JsonResponseViewModel { ResponseCode = 1, ResponseMessage = Message.CAPNHAT_THANHCONG });
            }
            else
            {
                return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = res.NAME });
            }
        }


        //public IActionResult GenerateBarcodes(string jsonData, string mspn)
        //{
        //    try
        //    {
        //        JArray jsonArray = JArray.Parse(jsonData);
        //        List<string> barcodeValues = new List<string>();
        //        foreach (JObject jsonObject in jsonArray)
        //        {
        //            string msPtValue = (string)jsonObject["MS_PT"];
        //            barcodeValues.Add(msPtValue);
        //        }

        //        Document document = new Document();
        //        MemoryStream memoryStream = new MemoryStream();
        //        PdfWriter writer = PdfWriter.GetInstance(document, memoryStream);
        //        document.Open();

        //        // create a new table to hold the barcodes
        //        PdfPTable table = new PdfPTable(3);

        //        // create a new barcode writer
        //        BarcodeWriter writer = new BarcodeWriter
        //        {
        //            Format = BarcodeFormat.CODE_128,
        //            Options = new EncodingOptions
        //            {
        //                Height = 200,
        //                Width = 600,
        //                Margin = 10
        //            }
        //        };

        //        // loop through each barcode value and add it to the table
        //        foreach (string barcodeValue in barcodeValues)
        //        {
        //            // create a new barcode image
        //            iTextSharp.text.Image barcodeImage = barcodeWriter.Write(barcodeValue);

        //            // add the barcode image to a new cell in the table
        //            PdfPCell cell = new PdfPCell(new iTextSharp.text.Image(barcodeImage, null));
        //            cell.Padding = 10;
        //            cell.HorizontalAlignment = Element.ALIGN_CENTER;
        //            cell.VerticalAlignment = Element.ALIGN_MIDDLE;
        //            table.AddCell(cell);
        //        }

        //        // add the table to the PDF document
        //        document.Add(table);

        //        // close the PDF document and memory stream
        //        document.Close();
        //        memoryStream.Close();

        //        // return the PDF file to the client
        //        byte[] bytes = memoryStream.ToArray();
        //        return File(bytes, "application/pdf", "barcodes.pdf");
        //    }
        //    catch (Exception ex)
        //    {
        //        return null;
        //    }
        //}
    }
}
