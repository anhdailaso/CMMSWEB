using Dapper;
using Microsoft.ApplicationBlocks.Data;
using System.Data;
using VietSoft.CMMS.Core.Models;
using VietSoft.CMMS.Web.Helpers;
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

        public ResponseViewModel DeletePhieuXuatKho(string mspx, string userName, int languages)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "DELETE_PHIEU_XUAT_KHO");
                p.Add("@sCot1", mspx);
                p.Add("@UserName", userName);
                p.Add("@NNgu", languages);
                var res = _dapper.Execute<ResponseViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res != null ? res : new ResponseViewModel()
                {
                    MA = 0
                };
            }
            catch
            {
                return new ResponseViewModel()
                {
                    MA = -1
                };
            }
        }

        public ResponseViewModel DeletePhuTungXuatXuatKho(string mspt, string mspn, string mspx, int languages)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "DELETE_PHU_TUNG_XUAT_KHO");
                p.Add("@sCot1", mspx);
                p.Add("@sCot2", mspt);
                p.Add("@sCot3", mspn);
                p.Add("@NNgu", languages);
                var res = _dapper.Execute<ResponseViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res != null ? res : new ResponseViewModel()
                {
                    MA = 0
                };
            }
            catch
            {
                return new ResponseViewModel()
                {
                    MA = -1
                };
            }
        }

        public ResponseViewModel ScanPhuTung(string macode, string mspx, int languages)
        {
            try
            {
                string[] resulst = macode.Split('*');
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "SCAN_PHU_TUNG_XUAT");
                p.Add("@sCot1", mspx);
                p.Add("@sCot2", resulst[0]);//mspt
                p.Add("@sCot3", resulst[1]);//msdhn
                p.Add("@NNgu", languages);
                var res = _dapper.Execute<ResponseViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res != null ? res : new ResponseViewModel()
                {
                    MA = 0
                };
            }
            catch
            {
                return new ResponseViewModel()
                {
                    MA = -1,
                    NAME = "Barcode sai định dạng!",
                };
            }
        }

        public ResponseViewModel LockPhieuXuatKho(string mspx)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "LOCK_PHIEU_XUAT_KHO");
                p.Add("@sCot1", mspx);
                var res = _dapper.Execute<ResponseViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res != null ? res : new ResponseViewModel()
                {
                    MA = 0
                };
            }
            catch
            {
                return new ResponseViewModel()
                {
                    MA = -1
                };
            }
        }

        public ResponseViewModel SavePhieuXuatKho(GoodIssueDetailsModel model,string userName)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "SAVE_PHIEU_XUAT_KHO");
                p.Add("@sCot1", model.MS_DH_XUAT_PT);
                p.Add("@dCot1", DateTime.Now);
                p.Add("@iCot1", model.MS_KHO);
                p.Add("@iCot2", model.MS_DANG_XUAT);
                p.Add("@sCot2", model.NGUOI_NHAN);
                p.Add("@dCot2", model.NGAY_CHUNG_TU);
                p.Add("@sCot3", model.SO_CHUNG_TU == null ? "" : model.SO_CHUNG_TU);
                p.Add("@sCot4", model.MS_PHIEU_BAO_TRI);
                p.Add("@sCot5", model.GHI_CHU);
                p.Add("@iCot3", model.MS_BP_CHIU_PHI);
                p.Add("@bCot1", model.THEM);
                p.Add("@UserName", userName);
                var res = _dapper.Execute<ResponseViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res != null ? res : new ResponseViewModel()
                {
                    MA = 0
                };
            }
            catch
            {
                return new ResponseViewModel()
                {
                    MA = -1
                };
            }
        }

        public ResponseViewModel AddPhuTungXuat(string username, string data, string mspx, int languages)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "ADD_PHU_TUNG_XUAT");
                p.Add("@UserName", username);
                p.Add("@sCot1", mspx);
                p.Add("@json", data);
                p.Add("@NNgu", languages);
                var res = _dapper.Execute<ResponseViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return new ResponseViewModel();
            }
        }
    }
}
