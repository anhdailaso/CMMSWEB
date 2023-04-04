using Dapper;
using Microsoft.ApplicationBlocks.Data;
using System.Data;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Models;
using VietSoft.CMMS.Web.Models.Maintenance;

namespace VietSoft.CMMS.Web.Services
{
    public class GoodIssueService : IGoodIssueService
    {
        private readonly IDapperService _dapper;
        public GoodIssueService(IDapperService dapper)
        {
            _dapper = dapper;
        }
        public List<GoodIssueViewModel> GetListGoodIssue(string username,int languages, DateTime? tngay, DateTime? dngay, string mskho)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "GET_GOODISSUE");
                p.Add("@dCot1", tngay);
                p.Add("@dCot2", dngay);
                p.Add("@sCot1", mskho);
                p.Add("@UserName", username);
                p.Add("@NNgu", languages);
                List<GoodIssueViewModel>? res = _dapper.GetAll<GoodIssueViewModel>("spCMMSWEB", p, CommandType.StoredProcedure);
                return res;
            }
            catch(Exception ex)
            {
                return null;
            }
        }

        public List<DanhSachPhuTungXuatKhoModel> GetListPhuTungXuat(string username, int languages, string mspx)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "DANH_SACH_PHU_TUNG_XUAT");
                p.Add("@sCot1", mspx);
                p.Add("@UserName", username);
                p.Add("@NNgu", languages);
                List<DanhSachPhuTungXuatKhoModel>? res = _dapper.GetAll<DanhSachPhuTungXuatKhoModel>("spCMMSWEB", p, CommandType.StoredProcedure);
                return res;
            }
            catch
            {
                return null;
            }
        }

        public List<ChonDanhSachPhuTungXuatModel> GetListChonPhuTungXuat(bool theobt,string username, int languages, string mspx)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "CHON_PHU_TUNG_XUAT");
                p.Add("@sCot1", mspx);
                p.Add("@bCot1", theobt);
                p.Add("@UserName", username);
                p.Add("@NNgu", languages);
                List<ChonDanhSachPhuTungXuatModel>? res = _dapper.GetAll<ChonDanhSachPhuTungXuatModel>("spCMMSWEB", p, CommandType.StoredProcedure);
                return res;
            }
            catch
            {
                return null;
            }
        }


        public GoodIssueDetailsModel GetGoodIssueDetails(string username, int languages, string mspn, int mskho)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "GET_GOODISSUE_DETAILS");
                p.Add("@sCot1", mspn);
                p.Add("@iCot1", mskho);
                p.Add("@UserName", username);
                p.Add("@NNgu", languages);
                var res = _dapper.Execute<GoodIssueDetailsModel>("spCMMSWEB", p, CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return new GoodIssueDetailsModel();
            }
        }

        public string GetMaybyPhieuBaoTri(string mspbt)
        {
            
            try
            {
                string resulst = SqlHelper.ExecuteScalar(_dapper.GetDbconnection().ConnectionString, CommandType.Text, "SELECT A.MS_MAY + ' : ' +B.TEN_MAY FROM dbo.PHIEU_BAO_TRI A\r\nINNER JOIN dbo.MAY B ON B.MS_MAY = A.MS_MAY WHERE A.MS_PHIEU_BAO_TRI = '" + mspbt + "'").ToString();
                return resulst;
            }
            catch
            {
                return "";
            }
        }

        public BaoCaoXuatNhapTonViewModel GetBaoCaoNhapXuatTon(string username, int languages, DateTime? tngay, DateTime? dngay, int mskho,string mspt)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "GET_BAO_CAO_NHAP_XUAT_TON");
                p.Add("@dCot1", tngay);
                p.Add("@dCot2", dngay);
                p.Add("@sCot1", mspt == "-1" ? "" : mspt);
                p.Add("@iCot1", mskho);
                p.Add("@UserName", username);
                p.Add("@NNgu", languages);
                var res = _dapper.Execute<BaoCaoXuatNhapTonViewModel>("spCMMSWEB", p, CommandType.StoredProcedure);
                return res ==  null ? new BaoCaoXuatNhapTonViewModel() : res;
            }
            catch (Exception ex)
            {
                return new BaoCaoXuatNhapTonViewModel();
            }
        }



    }
}
