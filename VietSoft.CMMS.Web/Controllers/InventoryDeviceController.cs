using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using VietSoft.CMMS.Core.Models;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Models;
using VietSoft.CMMS.Web.Resources;

namespace VietSoft.CMMS.Web.Controllers
{

    public class InventoryDeviceController : BaseController
    {
        private readonly ILogger<InventoryDeviceController> _logger;
        private readonly IAccountService _accountService;
        private readonly IComboboxService _combobox;
        private readonly IDeviceService _device;


        public InventoryDeviceController(ILogger<InventoryDeviceController> logger, IAccountService accountService, IComboboxService combobox, IDeviceService device)
        {
            _logger = logger;
            _accountService = accountService;
            _combobox = combobox;
            _device = device;
        }

        [AllowAnonymous]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Index()
        {
            res = null;
            SelectList listDD = _combobox.GetCbbDiaDiem(SessionManager.CurrentUser.UserName, 0, 1);
            SelectListItem item = listDD.Where(x => x.Value.ToString() == "-1").FirstOrDefault();
            item.Text = "";
            ViewBag.ListNhaXuong = listDD;

            SelectList listMAY = _combobox.GetCbbMay("-1", -1, SessionManager.CurrentUser.UserName, 0, 1);
            SelectListItem itemMay = listMAY.Where(x => x.Value.ToString() == "-1").FirstOrDefault();
            itemMay.Text = "";
            ViewBag.ListMAY = listMAY;
            return View();
        }
        public static List<IventoryDeviceModel>? res;
        public IActionResult GetListInventoryDevice(int pageIndex, int pageSize, int reset)
        {
            if (reset == 1)
            {
                res = null;
            }
            PagedList<IventoryDeviceModel>? result = null;
            if (res == null)
            {
                res = _device.GetListIventoryDecice(SessionManager.CurrentUser.UserName);
                result = new PagedList<IventoryDeviceModel>(res, res.Count, pageIndex, pageSize);
            }
            result = new PagedList<IventoryDeviceModel>(res, res.Count, pageIndex, pageSize);
            return PartialView("_inventoryDetail", result);
        }
        public ActionResult SaveLisInventoryeDevice(string mskho, string tenkho, string msmay, string tenmay)
        {
            try
            {
                //kiêm tra lis res có tồn tại mấy đó chưa
                if (res.Count(x => x.MS_MAY.Equals(msmay)) == 0)
                {
                    IventoryDeviceModel model = new IventoryDeviceModel();
                    model.CHON = true;
                    model.NGAY_SCAN = DateTime.Now;
                    model.MS_KHO = mskho;
                    model.TEN_KHO = tenkho;
                    model.MS_MAY = msmay;
                    model.TEN_MAY = tenmay;
                    model.CHON = true;
                    res.Add(model);
                    return Json(new JsonResponseViewModel { ResponseCode = 1, ResponseMessage = Message.CAPNHAT_THANHCONG });
                }
                else
                {
                    return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = "Máy này đã được chờ kiểm kê!" });
                }
            }
            catch (Exception)
            {
                return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = Message.COLOI_XAYRA });
            }

        }


        [HttpPost]
        public ActionResult SaveListDataMoveDevice()
        {
            JsonSerializerSettings formatSettings = new JsonSerializerSettings
            {
                DateFormatString = "MM/dd/yyyy HH:mm:ss"
            };
            var jsonData = JsonConvert.SerializeObject(res, formatSettings);

            BaseResponseModel? resu = _device.SaveIventoryDevice(SessionManager.CurrentUser.UserName, jsonData);
            if (resu.MA == 1)
            {
                res = null;
                return Json(new JsonResponseViewModel { ResponseCode = 1, ResponseMessage = Message.CAPNHAT_THANHCONG });
            }
            else
            {
                return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = Message.COLOI_XAYRA });
            }

        }

    }
}
