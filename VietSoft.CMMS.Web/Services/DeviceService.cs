using Dapper;
using Microsoft.ApplicationBlocks.Data;
using System.Data;
using VietSoft.CMMS.Core.Models;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Models;

namespace VietSoft.CMMS.Web.Services
{
    public class DeviceService : IDeviceService
    {
        private readonly IDapperService _dapper;
        public DeviceService(IDapperService dapper)
        {
            _dapper = dapper;
        }
        public List<MoveDeviceModel> GetListMoveDecice(string username)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "GETLIST_MOVE_DEVICE");
                p.Add("@UserName", username);
                List<MoveDeviceModel>? res = _dapper.GetAll<MoveDeviceModel>("spCMMSWEB", p, CommandType.StoredProcedure);
                return res;
            }
            catch
            {
                return null;
            }
        }

        public BaseResponseModel SaveMoveDevice(string username, string json, bool loaidc)
        {
            try
            {
                //loaidc 0 là đi 1 là đến
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "SAVE_MOVE_DEVICE");
                p.Add("@bCot1", loaidc);
                p.Add("@UserName", username);
                p.Add("@json", json);
                var res = _dapper.Execute<BaseResponseModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res;
            }
            catch 
            {
                return new BaseResponseModel();
            }
        }

      
        public List<IventoryDeviceModel> GetListIventoryDecice(string username, int NNgu)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "GETLIST_INVENTORY_DEVICE");
                p.Add("@UserName", username);
                p.Add("@NNgu", NNgu);
                List<IventoryDeviceModel>? res = _dapper.GetAll<IventoryDeviceModel>("spCMMSWEB", p, CommandType.StoredProcedure);
                return res;
            }
            catch
            {
                return null;
            }
        }

        public BaseResponseModel SaveIventoryDevice(string username, string json)
        {
            try
            {
                //loaidc 0 là đi 1 là đến
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "SAVE_INVENTORY_DEVICE");
                p.Add("@UserName", username);
                p.Add("@json", json);
                var res = _dapper.Execute<BaseResponseModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res;
            }
            catch
            {
                return new BaseResponseModel();
            }
        }



    }
}
//2023-02-10T10:00:57.4711153+07:00