using Dapper;
using System.Data;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Models;

namespace VietSoft.CMMS.Web.Services
{
    public class HistoryRequestService: IHistoryRequestService
    {
        private readonly IDapperService _dapper;
        public HistoryRequestService(IDapperService dapper)
        {
            _dapper = dapper;
        }

        public List<HistoryRequestViewModel> GetListHistoryRequest(string username, int languages, DateTime? tngay, DateTime? dngay, string ms_may, int idNguoiYC, int pageIndex, int pageSize)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "HISTORY_REQUEST");
                p.Add("@iLoai", 1);
                p.Add("@TNgay", tngay);
                p.Add("@DNgay", dngay);
                p.Add("@UName", username);
                p.Add("@MS_MAY", ms_may == "" ? "-1" : ms_may);
                p.Add("@iCot1", idNguoiYC);
                p.Add("@NNgu", languages);

                //int TotalRows = p.Get<int>("@TotalRows");
                List<HistoryRequestViewModel>? res = _dapper.GetAll<HistoryRequestViewModel>("spWBaoTri", p, CommandType.StoredProcedure);
                return res;
            }
            catch
            {
                return null;
            }
        }
    }
}
