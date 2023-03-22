using Dapper;
using System.Data;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Models;

namespace VietSoft.CMMS.Web.Services
{
    public class GoodReceiptService: IGoodReceiptService
    {
        private readonly IDapperService _dapper;
        public GoodReceiptService(IDapperService dapper)
        {
            _dapper = dapper;
        }
        public List<GoodReceiptViewModel> GetListGoodReceipt(string username,int languages, DateTime? tngay, DateTime? dngay, string mskho)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "GET_GOODRECEIPT");
                p.Add("@dCot1", tngay);
                p.Add("@dCot2", dngay);
                p.Add("@sCot1", mskho);
                p.Add("@UserName", username);
                p.Add("@NNgu", languages);
                List<GoodReceiptViewModel>? res = _dapper.GetAll<GoodReceiptViewModel>("spCMMSWEB", p, CommandType.StoredProcedure);
                return res;
            }
            catch(Exception ex)
            {
                return null;
            }
        }
    }
}
