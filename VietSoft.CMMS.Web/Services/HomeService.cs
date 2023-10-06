using Dapper;
using VietSoft.CMMS.Web.Resources;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Models;
using VietSoft.CMMS.Web.Serilog;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.Data.SqlClient;
using VietSoft.CMMS.Web.Helpers;
using System.Reflection;
using System.Data;
using VietSoft.CMMS.Core.Models;
using Newtonsoft.Json;
using Microsoft.ApplicationBlocks.Data;
using System.Runtime.Intrinsics.X86;
using VietSoft.CMMS.Web.Models.Maintenance;
using Org.BouncyCastle.Asn1.Ocsp;
using Microsoft.AspNetCore.Mvc;

namespace VietSoft.CMMS.Web.Services
{
    public class HomeService : IHomeService
    {
        private readonly IDapperService _dapper;
        public HomeService(IDapperService dapper)
        {
            _dapper = dapper;
        }
        public List<MyEcomaintViewModel> GetMyEcomain(string username, int languages, DateTime? dngay, string ms_nx, string mslmay, bool xuly,bool locNV, int pageIndex, int pageSize)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "GET_MYECOMAINT");
                p.Add("@DNgay", dngay);
                p.Add("@UserName", username);
                p.Add("@MsNXuong", ms_nx);
                p.Add("@sCot1", mslmay);
                p.Add("@NNgu", languages);
                p.Add("@bcot1", xuly);
                p.Add("@bcot2", locNV);
                //int TotalRows = p.Get<int>("@TotalRows");
                List<MyEcomaintViewModel>? res = _dapper.GetAll<MyEcomaintViewModel>("spCMMSWEB", p, CommandType.StoredProcedure).OrderBy(x => x.TEN_MAY).ToList();

                res.Where(x => x.sListYC != "").ToList().ForEach(r => r.ListYC = JsonConvert.DeserializeObject<List<MyEcomaintYeuCauModel>>(r.sListYC));

                res.Where(x => x.sListBT != "").ToList().ForEach(r => r.ListBT = JsonConvert.DeserializeObject<List<MyEcomaintBaoTriModel>>(r.sListBT));

                res.Where(x => x.sListGS != "").ToList().ForEach(r => r.ListGS = JsonConvert.DeserializeObject<List<MyEcomaintGiamSatModel>>(r.sListGS));

                return res.OrderBy(x => x.MS_MAY).ToList();
            }
            catch
            {
                return null;
            }
            //List<MyEcomaintViewModel> list = null;
            //try
            //{
            //    List<SqlParameter> listParameter = new List<SqlParameter>();
            //    listParameter.Add(new SqlParameter("@TNgay", tngay));
            //    listParameter.Add(new SqlParameter("@DNgay", dngay));
            //    listParameter.Add(new SqlParameter("@UserName", username));
            //    listParameter.Add(new SqlParameter("@MsNXuong", ms_nx));
            //    listParameter.Add(new SqlParameter("@MsMay", may == "" ? "-1" : may));
            //    listParameter.Add(new SqlParameter("@GiaiDoan", giaidoan));
            //    listParameter.Add(new SqlParameter("@NNgu", languages));
            //    list = DBUtils.ExecuteSPList<MyEcomaintViewModel>("spGetPBTGSTT", listParameter, AppName.Model1);
            //}
            //catch (Exception ex)
            //{
            //}
            //return list;
        }

        public MorningToringViewModel GetMorningToring(string msgstt, string userName, string deviceId, bool flag)
        {
            
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "GET_MORNINGTORING");
                p.Add("@deviceID", deviceId);
                p.Add("@UserName", userName);
                p.Add("@bCot1", flag);
                p.Add("@sCot1", msgstt);
                var res = _dapper.Execute<MorningToringViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res ?? new MorningToringViewModel();
            }
            catch (Exception ex)
            {
                return new MorningToringViewModel();
            }
        }

        public List<MonitoringParametersByDevice> GetMonitoringParametersByDevice(string username, int languages, string may, int isDue, int stt)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "MORNINGTORING");    
                p.Add("@UserName", username);
                p.Add("@NNgu", languages);
                p.Add("@deviceID", may == "" ? "-1" : may);
                p.Add("@isDue", isDue);
                p.Add("@iCot1", stt);
                List<MonitoringParametersByDevice>? res = _dapper.GetAll<MonitoringParametersByDevice>("spCMMSWEB", p, CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public List<string> GetMenu(string username)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "GET_MENU");
                p.Add("@UserName", username);
                List<string> res = _dapper.GetAll<string>("spCMMSWEB", p, CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return null;
            }
        }



        public int QuyenMenuGSTT(string username)
        {
            try
            {
                return Convert.ToInt32(SqlHelper.ExecuteScalar(_dapper.GetDbconnection().ConnectionString, CommandType.Text, "SELECT COUNT(*) FROM dbo.USERS A\r\nINNER JOIN dbo.NHOM_MENU B ON B.GROUP_ID = A.GROUP_ID\r\nWHERE A.USERNAME = '" + username + "' AND B.MENU_ID ='mnuGiamsattinhtrang'\r\n"));
            }
            catch (Exception ex)
            {
                return 0;
            }
        }

        public string GetSoPhieuYeu(string ms)
        {
            string resulst = "";
            try
            {
                switch (ms)
                {
                    case "WR":
                        {
                            resulst = "SELECT dbo.AUTO_CREATE_SO_PHIEU_YC(GETDATE())";
                            break;
                        }
                    default:
                        break;
                }
                return Convert.ToString(SqlHelper.ExecuteScalar(_dapper.GetDbconnection().ConnectionString, CommandType.Text, resulst));
            }
            catch (Exception ex)
            {
                return "";
            }
        }

        public int UpdateAvatar(string username, IFormFile image)
        {
            try
            {
                byte[] fileData = null;
                if(image != null)
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        image.CopyTo(memoryStream);
                        fileData = memoryStream.ToArray();
                    }
                    SessionManager.CurrentUser.Avatar = Convert.ToBase64String(fileData);

                }
                else
                {
                    SessionManager.CurrentUser.Avatar = null;
                }    
                string sql = "UPDATE dbo.USERS SET AVATAR = @FileData WHERE USERNAME = @Username";
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("@FileData", fileData, DbType.Binary); // Thêm giá trị của tệp vào tham số @FileData
                parameters.Add("@Username", username);
                _dapper.ExecuteNonQuery(sql, parameters,CommandType.Text);
                return 1;
            }
            catch (Exception ex)
            {
                return 0;
            }
        }

        public UserRequestViewModel GetUserRequest(string msyc, string msmay, string username, int them)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "GetUserRequest");
                p.Add("@deviceID", msmay);
                p.Add("@UserName", username);
                p.Add("@stt", them);
                p.Add("@sCot1", msyc);
                var res = _dapper.Execute<UserRequestViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return new UserRequestViewModel();
            }
        }

        public BaseResponseModel SaveMonitoring(MorningToringViewModel model,string msmay, string username, string data)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "SAVE_MONINGTORING");
                p.Add("@UserName", username);
                p.Add("@dCot1", model.NGAY_KH);
                p.Add("@sCot1", model.NHAN_XET);
                p.Add("@iCot1", model.MUC_UU_TIEN);
                p.Add("@stt", model.STT);
                p.Add("@deviceID", msmay);
                p.Add("@json", data);
                var res = _dapper.Execute<BaseResponseModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return new BaseResponseModel();
            }
        }

        public BaseResponseModel DeleteUserRequest(int stt)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "DELETE_USEREQUEST");
                p.Add("@stt", stt);
                var res = _dapper.Execute<BaseResponseModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return new BaseResponseModel();
            }
        }

        public BaseResponseModel SaveUserRequest(string username, UserRequestViewModel request)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "SAVE_USEREQUEST");
                p.Add("@deviceID", request.MS_MAY);
                p.Add("@icot1", request.DUYET);
                p.Add("@icot2", request.MS_UU_TIEN);
                p.Add("@icot3", request.MS_NGUYEN_NHAN);
                p.Add("@scot1", request.MO_TA_TINH_TRANG);
                p.Add("@scot2", request.YEU_CAU);
                p.Add("@scot3", request.NGUOI_YEU_CAU);
                p.Add("@stt", request.STT);
                p.Add("@dCot1", request.NGAY_XAY_RA);
                p.Add("@bCot1", request.HONG);
                p.Add("@UserName", username);
                p.Add("@json", request.Files);
                var res = _dapper.Execute<BaseResponseModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                if (request.HONG == true)
                {
                    //2.Lập Yêu cầu bảo trì có hư hỏng máy đột xuất  
                    Commons.SendThongBao(2, "YEU_CAU_NSD", res.NAME, request.MS_MAY, _dapper.GetDbconnection().ConnectionString);
                }
                return res;
            }
            catch (Exception ex)
            {
                return new BaseResponseModel();
            }
        }

        public BaseResponseModel SaveAcceptUserRequest(string username, AcceptUserRequest request)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "CAP_NHAT_DUYET_USEREQUEST");
                p.Add("@deviceID", request.MS_MAY);
                p.Add("@sCot1", request.GHI_CHU);
                p.Add("@iCot1", request.LOAI);
                p.Add("@stt", request.STT);
                var res = _dapper.Execute<BaseResponseModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return new BaseResponseModel();
            }
        }


        public IEnumerable<NguoiThucHienModel> GetNguoiThucHienGS(string userName, string deviceId, int stt, int languages)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "GET_NGUOI_THUC_HIEN_GS");
                p.Add("@stt", stt);
                p.Add("@deviceID", deviceId);
                p.Add("@UserName", userName);
                p.Add("@NNgu", languages);
                var res = _dapper.GetAll<NguoiThucHienModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public ResponseViewModel SaveNguoiThucHienGS(int stt, string json)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "SAVE_NGUOI_THU_HIEN_GS");
                p.Add("@stt", stt);
                p.Add("@json", json);
                var res = _dapper.Execute<ResponseViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                if (res != null)
                {
                    return res;
                }
                else
                {
                    return new ResponseViewModel
                    {
                        MA = 0
                    };
                }

            }
            catch (Exception ex)
            {
                return new ResponseViewModel()
                {
                    MA = -1
                };
            }
        }

        public ResponseViewModel Completed(int stt,string username)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "COMPLETE_GSTT");
                p.Add("@stt", stt);
                p.Add("@UserName", username);
                
                var res = _dapper.Execute<ResponseViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res != null ? res : new ResponseViewModel()
                {
                    MA = 0
                };
            }
            catch (Exception ex)
            {
                return new ResponseViewModel()
                {
                    MA = -1
                };
            }
        }
     
        public ResponseViewModel DeleteGSTT(int stt)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "DELETE_GSTT");
                p.Add("@stt", stt);
                var res = _dapper.Execute<ResponseViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res != null ? res : new ResponseViewModel()
                {
                    MA = 0
                };
            }
            catch (Exception ex)
            {
                return new ResponseViewModel()
                {
                    MA = -1
                };
            }
        }


    }
}
