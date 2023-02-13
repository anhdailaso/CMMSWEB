using Dapper;
using System.Data;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Models;

namespace VietSoft.CMMS.Web.Services
{
    public class HistoryService : IHistoryService
    {
        private readonly IDapperService _dapper;
        public HistoryService(IDapperService dapper)
        {
            _dapper = dapper;
        }
        public List<HistoryViewModel> GetListHistory(string username, int languages, DateTime? tngay, DateTime? dngay, string ms_may, bool tt_phutung, int ms_bp, string ms_pt ,int pageIndex, int pageSize)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "HISTORY");
                p.Add("@iLoai", 2);
                p.Add("@dCot1", tngay);
                p.Add("@dCot2", dngay);
                p.Add("@UserName", username);
                p.Add("@deviceID", ms_may == "" ? "-1" : ms_may);
                p.Add("@sCot1", ms_bp);
                p.Add("@sCot2", ms_pt);
                p.Add("@NNgu", languages);  
                p.Add("@bCot1", tt_phutung);
                //int TotalRows = p.Get<int>("@TotalRows");
                List<HistoryViewModel>? res = _dapper.GetAll<HistoryViewModel>("spCMMSWEB", p, CommandType.StoredProcedure);
                return res;
            }
            catch
            {
                return null;
            }
        }
    }
}
