using Dapper;
using System.Data;
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
                p.Add("@TNgay", "01/01/2022");
                p.Add("@DNgay", "01/01/2022");
                p.Add("@UName", username);
                p.Add("@MS_MAY", ms_may == "" ? "-1" : ms_may);
                p.Add("@MS_BP", ms_bp);
                p.Add("@MS_PT", ms_pt);
                p.Add("@NNgu", languages);
                p.Add("@bCOT1", tt_phutung);

                //int TotalRows = p.Get<int>("@TotalRows");
                List<HistoryViewModel>? res = _dapper.GetAll<HistoryViewModel>("spWBaoTri", p, CommandType.StoredProcedure);
                return res;
            }
            catch
            {
                return null;
            }
        }
    }
}
