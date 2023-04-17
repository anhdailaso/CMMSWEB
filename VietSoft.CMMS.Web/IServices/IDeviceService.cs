using VietSoft.CMMS.Core.Models;
using VietSoft.CMMS.Web.Models;

namespace VietSoft.CMMS.Web.IServices
{
    public interface IDeviceService
    {
        public List<MoveDeviceModel> GetListMoveDecice(string username);
        public BaseResponseModel SaveMoveDevice(string username, string json, bool loaidc);
        public List<IventoryDeviceModel> GetListIventoryDecice(string username, int NNgu);
        public BaseResponseModel SaveIventoryDevice(string username, string json);
        
    }
}
