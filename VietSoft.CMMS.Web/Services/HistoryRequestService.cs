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

        public List<HistoryRequestViewModel> GetListHistoryRequest(string username, int languages, DateTime? tngay, DateTime? dngay, string ms_may,string nguoiyc)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "HISTORY_REQUEST");
                p.Add("@iLoai", 1);
                p.Add("@dCot1", tngay);
                p.Add("@dCot2", dngay);
                p.Add("@UserName", username);
                p.Add("@deviceID", ms_may == "" ? "-1" : ms_may);
                p.Add("@sCot1", nguoiyc == null ? "-1" : nguoiyc);
                p.Add("@NNgu", languages);

                //int TotalRows = p.Get<int>("@TotalRows");
                List<HistoryRequestViewModel>? res = _dapper.GetAll<HistoryRequestViewModel>("spCMMSWEB", p, CommandType.StoredProcedure);
                return res;
            }
            catch(Exception ex)
            {
                return null;
            }
        }

        public ViewChitietPhieuBaoTriModel ViewChiTietPBT(string username, int languages, string mspbt)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "VIEW_CHI_TIET_PBT");
                p.Add("@sCot1", mspbt);
                p.Add("@UserName", username);
                p.Add("@NNgu", languages);
                var res = _dapper.Execute<ViewChitietPhieuBaoTriModel>("spCMMSWEB", p, CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return new ViewChitietPhieuBaoTriModel();
            }
        }



    }
}
