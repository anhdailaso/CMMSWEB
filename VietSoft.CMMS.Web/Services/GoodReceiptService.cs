using Dapper;
using System.Data;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Models;
using VietSoft.CMMS.Web.Models.Maintenance;

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

        public List<DanhSachPhuTungNhapKhoModel> GetListPhuTungNhap(string username, int languages, string mspn)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "PARTS_LIST");
                p.Add("@sCot1", mspn);
                p.Add("@UserName", username);
                p.Add("@NNgu", languages);
                List<DanhSachPhuTungNhapKhoModel>? res = _dapper.GetAll<DanhSachPhuTungNhapKhoModel>("spCMMSWEB", p, CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public List<PhuTungModel> GetListChonPhuTungNhap(string username, int languages, string mspn)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "CHOOSE_PARTS_LIST");
                p.Add("@sCot1", mspn);
                p.Add("@UserName", username);
                p.Add("@NNgu", languages);
                List<PhuTungModel>? res = _dapper.GetAll<PhuTungModel>("spCMMSWEB", p, CommandType.StoredProcedure);
                return res;
            }
            catch
            {
                return null;
            }
        }


        public GoodReceiptDetailsModel GetGoodReceiptDetails(string username, int languages, string mspn, int mskho)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "GET_GOODRECEIPT_DETAILS");
                p.Add("@sCot1", mspn);
                p.Add("@iCot1", mskho);
                p.Add("@UserName", username);
                p.Add("@NNgu", languages);
                var res = _dapper.Execute<GoodReceiptDetailsModel>("spCMMSWEB", p, CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return new GoodReceiptDetailsModel();
            }
        }

        public PhieuNhapKhoPhuTungMore GetPhieuNhapKhoPhuTungMore(string username, int languages, string mspn, string mspt)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "GET_PHIEU_NHAP_KHO_PHU_TUNG_MORE");
                p.Add("@sCot1", mspn);
                p.Add("@sCot2", mspt);
                p.Add("@UserName", username);
                p.Add("@NNgu", languages);
                var res = _dapper.Execute<PhieuNhapKhoPhuTungMore>("spCMMSWEB", p, CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return new PhieuNhapKhoPhuTungMore();
            }
        }

        
        public List<PhieuNhapKhoChiPhiModel> GetCHiPhiPhieuNhapKho(int languages, string mspn, int iloai)
        {
            //1 là xem 
            //2sua
            try
            {
                var p = new DynamicParameters();
                p.Add("@MS_DH_NHAP_PT", mspn);
                p.Add("@NNGU", languages);
                p.Add("@@LOAI", iloai);
                var res = _dapper.GetAll<PhieuNhapKhoChiPhiModel>("GetChiPhiDHN", p, CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return new List<PhieuNhapKhoChiPhiModel> ();
            }
        }


        public List<ViTriNhapKhoModel> GetViTriNhapKho(string username, int languages, string mspn, string mspt)
        {
            //1 là xem 
            //2sua
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "GET_PHIEU_NHAP_KHO_PHU_TUNG_VI_TRI");
                p.Add("@sCot1", mspn);
                p.Add("@sCot2", mspt);
                p.Add("@UserName", username);
                p.Add("@NNgu", languages);
                var res = _dapper.GetAll<ViTriNhapKhoModel>("spCMMSWEB", p, CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return new List<ViTriNhapKhoModel>();
            }
        }


        public ResponseViewModel DeletePhieuNhapKho(string mspn, string userName)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "DELETE_PHIEU_NHAP_KHO");
                p.Add("@sCot1", mspn);
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

    }
}
