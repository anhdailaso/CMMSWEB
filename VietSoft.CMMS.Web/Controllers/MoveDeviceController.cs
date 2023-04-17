using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Web.Script.Serialization;
using VietSoft.CMMS.Core.Models;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Models;
using VietSoft.CMMS.Web.Resources;
using VietSoft.CMMS.Web.Services;

namespace VietSoft.CMMS.Web.Controllers
{

    public class MoveDeviceController : BaseController
    {
        private readonly ILogger<MoveDeviceController> _logger;
        private readonly IAccountService _accountService;
        private readonly IComboboxService _combobox;
        private readonly IDeviceService _device;
        public MoveDeviceController(ILogger<MoveDeviceController> logger, IAccountService accountService, IComboboxService combobox, IDeviceService device)
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
            SelectList listDD = _combobox.GetCbbDiaDiem(SessionManager.CurrentUser.UserName, SessionManager.CurrentUser.TypeLangue, 1);
            SelectListItem item = listDD.Where(x => x.Value.ToString() == "-1").FirstOrDefault();
            item.Text = "";
            ViewBag.ListNhaXuong = listDD;

            SelectList listMAY = _combobox.GetCbbMay("-1", -1, SessionManager.CurrentUser.UserName, SessionManager.CurrentUser.TypeLangue,1);
            SelectListItem itemMay = listMAY.Where(x => x.Value.ToString() == "-1").FirstOrDefault();
            itemMay.Text = "";
            ViewBag.ListMAY = listMAY;
            return View();
        }
        public static List<MoveDeviceModel>? res;

        public IActionResult GetListMoveDevice(int pageIndex, int pageSize, string msnx, string msmay,bool loaidc,int reset)
        {
            if(reset == 1)
            {
                res = null;
            }    
            PagedList<MoveDeviceModel>? result = null;
            if(res == null)
            {
                res = _device.GetListMoveDecice(SessionManager.CurrentUser.UserName);
                result = new PagedList<MoveDeviceModel>(res.Where(x => x.NGAY_NHAN == null).ToList(), res.Count, pageIndex, pageSize);
            }
            else
            {
                if(loaidc == false)
                {
                    result = new PagedList<MoveDeviceModel>(res.Where(x=>x.NGAY_NHAN == null).ToList(), res.Count, pageIndex, pageSize);
                }
                else
                {
                    result = new PagedList<MoveDeviceModel>(res.Where(x => x.NGAY_NHAN != null).ToList(), res.Count, pageIndex, pageSize);
                }    
            }
            return PartialView("_movedevice", result);
        }

        [HttpPost]
        public ActionResult SaveListMoveDevice(string khodi,string khoden,string tenkhodi,string tenkhoden,string msmay,string tenmay, bool loaidc)
        {
            try
            {
                //kiêm tra lis res có tồn tại mấy đó chưa
                if(loaidc == false)
                {
                    if (res.Count(x => x.MS_MAY.Equals(msmay)) == 0)
                    {
                        MoveDeviceModel model = new MoveDeviceModel();
                        model.CHON = true;
                        model.NGAY_CHUYEN = DateTime.Now;
                        model.KHO_DI = khodi;
                        model.KHO_DEN = khoden;
                        model.TEN_KHO_DI = tenkhodi;
                        model.TEN_KHO_DEN = tenkhoden;
                        model.MS_MAY = msmay;
                        model.TEN_MAY = tenmay;
                        model.SO_NGAY = 0;
                        res.Add(model);
                        return Json(new JsonResponseViewModel { ResponseCode = 1, ResponseMessage = Message.CAPNHAT_THANHCONG });
                    }
                    else
                    {
                        return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = "Máy này đã được di chuyển rồi!" });
                    }
                }
                else
                {
                    //kiểm tra mấy có tồn tại trong kho vận chuyển hay không
                    if (res.Count(x => x.MS_MAY.Equals(msmay) && x.NGAY_NHAN == null) > 0)
                    {
                        MoveDeviceModel model = new MoveDeviceModel();
                        model = res.Where(x => x.MS_MAY.Equals(msmay) && x.NGAY_NHAN == null).FirstOrDefault();
                        model.NGAY_NHAN = DateTime.Now;
                        return Json(new JsonResponseViewModel { ResponseCode = 1, ResponseMessage = Message.CAPNHAT_THANHCONG });
                    }
                    else
                    {
                        return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = "Máy này không có trong kho đến!" });
                    }
                }    
            }
            catch (Exception)
            {
                return Json(new JsonResponseViewModel { ResponseCode = -1, ResponseMessage = Message.COLOI_XAYRA });
            }
            
        }
        public ActionResult getToDevices()
        {
            var listItem = res.Select(
             x => new SelectListItem
             {
                 Text = x.MS_MAY,
                 Value = x.MS_MAY
             }).Distinct().ToList();
            listItem.Add(new SelectListItem() { Value = "-1", Text = "" });
            SelectList list = new SelectList(listItem.OrderBy(x=>x.Value), "Value", "Text", null);
            return Json(list);
        }


        [HttpPost]
        public ActionResult SaveListDataMoveDevice(bool loaidc)
        {
            JsonSerializerSettings formatSettings = new JsonSerializerSettings
            {
                DateFormatString = "MM/dd/yyyy HH:mm:ss"
            };
            var jsonData = JsonConvert.SerializeObject(res, formatSettings);

            //string jsonData = new JavaScriptSerializer().Serialize(res);

            BaseResponseModel? resu = _device.SaveMoveDevice(SessionManager.CurrentUser.UserName, jsonData, loaidc);
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
