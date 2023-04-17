using Dapper;
using System.Data;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Models;
using VietSoft.CMMS.Web.Models.Maintenance;

namespace VietSoft.CMMS.Web.Services
{
    public class GoodReceiptService : IGoodReceiptService
    {
        private readonly IDapperService _dapper;
        public GoodReceiptService(IDapperService dapper)
        {
            _dapper = dapper;
        }
        public List<GoodReceiptViewModel> GetListGoodReceipt(string username, int languages, DateTime? tngay, DateTime? dngay, string mskho)
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
            catch (Exception ex)
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
                return new List<PhieuNhapKhoChiPhiModel>();
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


        public ResponseViewModel DeletePhieuNhapKho(string mspn, string userName, int languages)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "DELETE_PHIEU_NHAP_KHO");
                p.Add("@sCot1", mspn);
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

        public ResponseViewModel LockPhieuNhapKho(string mspn)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "LOCK_PHIEU_NHAP_KHO");
                p.Add("@sCot1", mspn);
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


        public ResponseViewModel SavePhieuNhapKho(GoodReceiptDetailsModel model, string userName)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "SAVE_PHIEU_NHAP_KHO");
                p.Add("@sCot1", model.MS_DH_NHAP_PT);
                p.Add("@dCot1", DateTime.Now);
                p.Add("@iCot1", model.MS_KHO);
                p.Add("@iCot2", model.MS_DANG_NHAP);
                p.Add("@sCot2", model.NGUOI_NHAP);
                p.Add("@dCot2",  model.NGAY_CHUNG_TU);
                p.Add("@sCot3", model.SO_CHUNG_TU == null ? "" : model.SO_CHUNG_TU);
                p.Add("@sCot4", model.GHI_CHU);
                p.Add("@sCot5", model.MS_DDH);
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


        public ResponseViewModel SaveThongTinPhuTung(PhieuNhapKhoPhuTungMore model, string userName)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "SAVE_THONG_TIN_PHU_TUNG");
                p.Add("@sCot1", model.MS_DH_NHAP_PT);
                p.Add("@sCot2", model.MS_PT);
                p.Add("@dCot1", model.BAO_HANH_DEN_NGAY);
                p.Add("@sCot3", model.XUAT_XU);
                p.Add("@fCot1", model.TY_GIA);
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


        public ResponseViewModel AddPhuTungNhap(string username, string data, string mspn)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "ADD_PHU_TUNG_NHAP");
                p.Add("@UserName", username);
                p.Add("@sCot1", mspn);
                p.Add("@json", data);
                var res = _dapper.Execute<ResponseViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return new ResponseViewModel();
            }
        }

        public ResponseViewModel SaveVitri(string username, string data, string mspn, string mspt, int languages)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "SAVE_VI_TRI");
                p.Add("@UserName", username);
                p.Add("@sCot1", mspn);
                p.Add("@sCot2", mspt);
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

        public ResponseViewModel SaveChiPhi(string username, string data, string mspn)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "SAVE_CHI_PHI");
                p.Add("@UserName", username);
                p.Add("@sCot1", mspn);
                p.Add("@json", data);
                var res = _dapper.Execute<ResponseViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return new ResponseViewModel();
            }
        }

        public ResponseViewModel SavePhuTungNhap(string username, string data, string mspn, int languages)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "SAVE_PHU_TUNG_NHAP");
                p.Add("@UserName", username);
                p.Add("@sCot1", mspn);
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

        public ResponseViewModel DeletePhuTungNhapKho(string mspt, string mspn, int languages)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "DELETE_PHU_TUNG_NHAP_KHO");
                p.Add("@sCot1", mspn);
                p.Add("@sCot2", mspt);
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
