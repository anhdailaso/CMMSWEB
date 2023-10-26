using Dapper;
using Microsoft.ApplicationBlocks.Data;
using Org.BouncyCastle.Asn1.Ocsp;
using System.Data;
using VietSoft.CMMS.Core.Models;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Models;
using VietSoft.CMMS.Web.Models.Maintenance;
using static iTextSharp.text.pdf.AcroFields;

namespace VietSoft.CMMS.Web.Services
{
    public class MaintenanceService : IMaintenanceService
    {
        private readonly IDapperService _dapper;
        public MaintenanceService(IDapperService dapper)
        {
            _dapper = dapper;
        }
        public List<AcceptMaintenanceModel> GetListAcceptMaintenance(string username, int languages, DateTime? tngay, DateTime? dngay, int NNgu)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "ACCEPT_MAINTENANCE");
                p.Add("@UserName", username);
                p.Add("@dCot1", tngay);
                p.Add("@dCot2", dngay);
                p.Add("@NNgu", NNgu);
                //int TotalRows = p.Get<int>("@TotalRows");
                List<AcceptMaintenanceModel>? res = _dapper.GetAll<AcceptMaintenanceModel>("spCMMSWEB", p, CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public TicketMaintenanceViewModel GetTicketMaintenanceByDevice(string mspbt, string userName, string deviceId, bool isNewTicket)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", CategoryType.GET_WORDORDER.ToString());
                p.Add("@deviceID", deviceId);
                p.Add("@UserName", userName);
                p.Add("@bCot1", !isNewTicket);
                p.Add("@sCot1", mspbt);
                var res = _dapper.Execute<TicketMaintenanceViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);

                return res ?? new TicketMaintenanceViewModel();

            }
            catch (Exception ex)
            {
                return new TicketMaintenanceViewModel();
            }
        }

        public TicketMaintenanceViewModel GetTicketMaintenanceByDevice(string mspbt)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "GET_WORDORDER_BY_MSBT");
                p.Add("@sCot1", mspbt);
                var res = _dapper.Execute<TicketMaintenanceViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                Commons.SendThongBao(14, "NGUOI_CO_TRACH_NHIEM", mspbt, res.USERNAME, _dapper.GetDbconnection().ConnectionString, SessionManager.CurrentUser.UserName);
                return res ?? new TicketMaintenanceViewModel();

            }
            catch (Exception ex)
            {
                return new TicketMaintenanceViewModel();
            }
        }


        public IEnumerable<WorkOrdersViewModel> GetWorkOrderList(string userName, string deviceId, string ticketId, int languages)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", CategoryType.GET_WORDORDER_DETAILS.ToString());
                p.Add("@sCot1", ticketId);
                p.Add("@deviceID", deviceId);
                p.Add("@UserName", userName);
                p.Add("@NNgu", languages);

                var res = _dapper.GetAll<WorkOrderDetailViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                if (res != null)
                {
                    var lst = res.GroupBy(
                        x => (x.MS_CV, x.MO_TA_CV, x.THAO_TAC, x.TIEU_CHUAN_KT, x.YEU_CAU_NS, x.YEU_CAU_DUNG_CU, x.MS_BO_PHAN, x.TEN_BO_PHAN, x.PATH_HD, x.PATH_IMAGE),
                        (key, data) => new { MS_CV = key.MS_CV, MO_TA_CV = key.MO_TA_CV, THAO_TAC = key.THAO_TAC, TIEU_CHUAN_KT = key.TIEU_CHUAN_KT, YEU_CAU_NS = key.YEU_CAU_NS, YEU_CAU_DUNG_CU = key.YEU_CAU_DUNG_CU, PATH_HD = key.PATH_HD, PATH_IMAGE = key.PATH_IMAGE, MS_BO_PHAN = key.MS_BO_PHAN, TEN_BO_PHAN = key.TEN_BO_PHAN, WorkOrderDetailViewModels = data }).ToList();
                    var workOrders = lst.Select(x =>
                    new WorkOrdersViewModel()
                    {
                        MS_BO_PHAN = x.MS_BO_PHAN,
                        TEN_BO_PHAN = x.TEN_BO_PHAN,
                        MS_CV = x.MS_CV,
                        MO_TA_CV = x.MO_TA_CV,
                        THAO_TAC = x.THAO_TAC,
                        TIEU_CHUAN_KT = x.TIEU_CHUAN_KT,
                        YEU_CAU_NS = x.YEU_CAU_NS,
                        YEU_CAU_DUNG_CU = x.YEU_CAU_DUNG_CU,
                        PATH_HD = x.PATH_HD,
                        Path = x.PATH_IMAGE,
                        Path64 = @"data:image/png;base64," + Commons.DownloadFileAsBase64(x.PATH_IMAGE).Result.ToString(),
                        WorkOrderDetailViewModels = x.WorkOrderDetailViewModels.Where(x => !string.IsNullOrEmpty(x.MS_PT)).Select(x => new WorkOrderDetailViewModel()
                        {
                            MS_PT = x.MS_PT,
                            MS_VI_TRI_PT = x.MS_VI_TRI_PT,
                            TEN_PT = x.TEN_PT,
                            SL_CT = x.SL_CT,
                            SL_KH = x.SL_KH,
                            SL_TT = x.SL_TT

                        })
                    }).AsEnumerable();
                    return workOrders;
                }

                return null;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public IEnumerable<WorkOrderDetailViewModel> GetJobList(string userName, string deviceId, string ticketId, int languages)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", CategoryType.GET_LIST_JOB.ToString());
                p.Add("@sCot1", ticketId);
                p.Add("@deviceID", deviceId);
                p.Add("@UserName", userName);
                p.Add("@NNgu", languages);
                var res = _dapper.GetAll<WorkOrderDetailViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public IEnumerable<NguoiThucHienModel> GetNguoiThucHien(string userName, string deviceId, string ticketId, int languages)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "GET_NGUOI_THUC_HIEN");
                p.Add("@sCot1", ticketId);
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

        public ThoiGianNgungMayModel GetThoiGianNgungMay(string ticketId, string userName, int languages, bool add)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "GET_THOI_GIAN_DUNG_MAY");
                p.Add("@sCot1", ticketId);
                p.Add("@UserName", userName);
                p.Add("@NNgu", languages);
                p.Add("@bCot1", add);
                var res = _dapper.Execute<ThoiGianNgungMayModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public IEnumerable<SuppliesViewModel> GetSuppliesList(string userName, string deviceId, string deptId, string ticketId, int languages)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", CategoryType.GET_LIST_SPAREPART.ToString());
                p.Add("@deviceID", deviceId);
                p.Add("@sCot1", ticketId);
                p.Add("@sCot2", deptId);
                p.Add("@UserName", userName);
                p.Add("@NNgu", languages);

                var res = _dapper.GetAll<SuppliesViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public IEnumerable<LogWorkViewModel> GetLogWorkList(string ticketId, string userName)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", CategoryType.GET_LIST_WORKING_TIME.ToString());
                p.Add("@sCot1", ticketId);
                p.Add("@UserName", userName);

                var res = _dapper.GetAll<LogWorkViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public IEnumerable<InventoryViewModel> GetListInventory(string ticketId, string mskho)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@PBT", ticketId);
                p.Add("@MSKho", mskho);
                var res = _dapper.GetAll<InventoryViewModel>("MTonKhoTheoPBT", p, System.Data.CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public IEnumerable<TreeViewModel> GetViewCauseOfDamageList(string deviceId, string keyWork)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", CategoryType.GET_LIST_FAILRULE_ANALYSIS.ToString());
                p.Add("@deviceID", deviceId);

                var res = _dapper.GetAll<CauseOfDamageModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                if (res != null)
                {
                    var query = res.Where(x => string.IsNullOrEmpty(keyWork) || x.MS_BO_PHAN.Contains(keyWork) || x.TEN_BO_PHAN.Contains(keyWork) || x.CAUSE_NAME.Contains(keyWork)
                    || x.CAUSE_CODE.Contains(keyWork) || x.CLASS_CODE.Contains(keyWork) || x.CLASS_NAME.Contains(keyWork)
                    || x.PROBLEM_NAME.Contains(keyWork) || x.PROBLEM_CODE.Contains(keyWork) || x.PROBLEM_ID.Contains(keyWork));

                    var lst = query.GroupBy(
                        x => (x.MS_BO_PHAN, x.PROBLEM_CODE, x.PROBLEM_ID, x.PROBLEM_NAME, x.GR_PROLEM),
                        (key, data) => new TreeViewModel
                        {
                            ItemCode = key.MS_BO_PHAN,
                            Id = key.PROBLEM_ID,
                            ItemName = key.PROBLEM_NAME,
                            Amount = key.GR_PROLEM,
                            Childs = data.GroupBy(c => (c.MS_BO_PHAN, c.PROBLEM_CODE, c.PROBLEM_ID, c.PROBLEM_NAME, c.CAUSE_ID, c.CAUSE_NAME, c.CAUSE_CODE, c.GR_CAUSE), (key, data) => new
                            {
                                Id = key.CAUSE_ID,
                                ItemCode = key.CAUSE_CODE,
                                ItemName = key.CAUSE_NAME,
                                Amount = key.GR_CAUSE,
                                Childs = data.Select(r => new
                                {
                                    ItemCode = r.REMEDY_CODE,
                                    Id = r.REMEDY_ID,
                                    ItemName = r.REMEDY_NAME,
                                    Key = $"{r.MS_MAY}|{r.MS_BO_PHAN}|{r.CLASS_ID}|{r.PROBLEM_ID}|{r.CAUSE_ID}|{r.REMEDY_ID}",
                                    Amount = r.GR_REMEDY,
                                })
                            }).Distinct().ToList()
                        }).ToList();
                    return lst;
                }

                return null;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public IEnumerable<TreeViewModel> GetInputCauseOfDamageList(string ticketId, string deviceId)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", CategoryType.GET_LISTWO_FAILRULE_ANALYSIS.ToString());
                p.Add("@sCot1", ticketId);
                p.Add("@deviceID", deviceId);

                var res = _dapper.GetAll<CauseOfDamageModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                if (res != null)
                {
                    var lst = res.GroupBy(
                         x => (x.MS_BO_PHAN, x.PROBLEM_CODE, x.PROBLEM_ID, x.PROBLEM_NAME),
                        (key, data) => new TreeViewModel
                        {
                            ItemCode = key.MS_BO_PHAN,
                            Id = key.PROBLEM_ID,
                            ItemName = key.PROBLEM_NAME,
                            Childs = data.GroupBy(c => (c.MS_BO_PHAN, c.PROBLEM_CODE, c.PROBLEM_ID, c.PROBLEM_NAME, c.CAUSE_ID, c.CAUSE_NAME, c.CAUSE_CODE), (key, data) => new
                            {
                                Id = key.CAUSE_ID,
                                ItemCode = key.CAUSE_CODE,
                                ItemName = key.CAUSE_NAME,
                                Childs = data.Select(r => new
                                {
                                    ItemCode = r.REMEDY_CODE,
                                    Id = r.REMEDY_ID,
                                    ItemName = r.REMEDY_NAME,
                                    Key = $"{r.MS_MAY}|{r.MS_BO_PHAN}|{r.CLASS_ID}|{r.PROBLEM_ID}|{r.CAUSE_ID}|{r.REMEDY_ID}"
                                })
                            }).Distinct().ToList()
                        }).ToList();
                    return lst;
                }

                return null;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public ResponseViewModel SaveSupplies(string deviceId, string ticketId, string userName, int workId, string dept, string json)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", CategoryType.SAVE_LIST_SPAREPART.ToString());
                p.Add("@sCot1", ticketId);
                p.Add("@deviceID", deviceId);
                p.Add("@UserName", userName);
                p.Add("@iCot1", workId);
                p.Add("@sCot2", dept);
                p.Add("@json", json);
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


        public ResponseViewModel Backlog(string ticketId, string userName, int workId, string dept)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "BACK_LOG");
                p.Add("@sCot1", ticketId);
                p.Add("@UserName", userName);
                p.Add("@iCot1", workId);
                p.Add("@sCot2", dept);
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

        public ResponseViewModel DeleteWork(string ticketId, string userName, int workId, string dept, int languages)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "DELETE_WORK");
                p.Add("@sCot1", ticketId);
                p.Add("@UserName", userName);
                p.Add("@iCot1", workId);
                p.Add("@sCot2", dept);
                p.Add("@NNgu", languages);
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

        public ResponseViewModel DeleteWorkOrder(string ticketId, string userName, int languages)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "DELETE_WORK_ORDER");
                p.Add("@sCot1", ticketId);
                p.Add("@UserName", userName);
                p.Add("@NNgu", languages);
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


        public ResponseViewModel SaveMaintenanceWork(string deviceId, string ticketId, string userName, string json)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", CategoryType.SAVE_LIST_JOB.ToString());
                p.Add("@sCot1", ticketId);
                p.Add("@deviceID", deviceId);
                p.Add("@UserName", userName);
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
        public ResponseViewModel SaveNguoiThucHien(string ticketId, string json)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "SAVE_NGUOI_THU_HIEN");
                p.Add("@sCot1", ticketId);
                p.Add("@json", json);
                var res = _dapper.Execute<ResponseViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                if (res != null)
                {
                    string[] aray = res.NAME.ToString().Split(';');
                    foreach (var item in aray)
                    {
                        if (item != "")
                        {
                            Commons.SendThongBao(2, "NGUOI_DUOC_GIAO_BAO_TRI", ticketId, item, _dapper.GetDbconnection().ConnectionString, item);
                        }

                    }
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

        public ResponseViewModel ThemCauTrucCongViec(string deviceId, string msbp, int mscv, string tenCV, int thoigian, bool them)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "THEM_CAU_TRUC_CONG_VIEC");
                p.Add("@sCot1", msbp);
                p.Add("@sCot2", tenCV);
                p.Add("@iCot1", mscv);
                p.Add("@iCot2", thoigian);
                p.Add("@bCot1", them);
                p.Add("@deviceID", deviceId);
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


        public ResponseViewModel SaveLogWork(string ticketId, string userName, string json)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", CategoryType.SAVE_LIST_WORKING_TIME.ToString());
                p.Add("@sCot1", ticketId);
                p.Add("@UserName", userName);
                p.Add("@json", json);

                var res = _dapper.Execute<ResponseViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return new ResponseViewModel()
                {
                    MA = -1
                };
            }
        }

        public ResponseViewModel SaveWorkOrder(string ticketId, DateTime ngaylap, DateTime ngaybd, DateTime ngaykt, int categoryTicketId, int priorityId, string statusDevice, string lydoBT, string userName, string deviceId, int them)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", CategoryType.SAVE_WORDORDER.ToString());
                p.Add("@sCot1", ticketId);
                p.Add("@dCot1", ngaylap);
                p.Add("@dCot2", ngaybd);
                p.Add("@dCot3", ngaykt);
                p.Add("@iCot1", categoryTicketId);
                p.Add("@iCot2", priorityId);
                p.Add("@iCot3", them);
                p.Add("@sCot3", statusDevice);
                p.Add("@sCot4", lydoBT);
                p.Add("@UserName", userName);
                p.Add("@deviceID", deviceId);
                var res = _dapper.Execute<ResponseViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);

                //gửi thông báo khi thêm = 1 và statusDevice có giá trị
                if (res.MA == 1 && !string.IsNullOrEmpty(statusDevice) && them == 1)
                {
                    Commons.SendThongBao(res.NAME.Split('!')[0] == "SHOW_HH" ? 8 : 7, "YEU_CAU_NSD", res.NAME.Split('!')[1], deviceId, _dapper.GetDbconnection().ConnectionString);
                }
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

        public ResponseViewModel CompletedWorkOrder(string ticketId, string userName, string deviceId, int languages)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", CategoryType.COMPLETE_WORDORDER.ToString());
                p.Add("@sCot1", ticketId);
                p.Add("@UserName", userName);
                p.Add("@deviceID", deviceId);
                var res = _dapper.Execute<ResponseViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);

                if (res.NAME == "SHOW_HH")
                {
                    Commons.SendThongBao(12, "PHIEU_BAO_TRI_HOAN_THANH", ticketId, deviceId, _dapper.GetDbconnection().ConnectionString, userName);
                }
                else
                {
                    Commons.SendThongBao(11, "PHIEU_BAO_TRI_HOAN_THANH", ticketId, deviceId, _dapper.GetDbconnection().ConnectionString, userName);
                }
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

        public ResponseViewModel AddMessage(string ticketId, string noidung, string guithem, string userName)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "ADD_MESSAGE");
                p.Add("@sCot1", ticketId);
                p.Add("@sCot2", noidung);
                p.Add("@UserName", userName);
                var res = _dapper.Execute<ResponseViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                if (res.NAME == "SHOW_HH")
                {
                    Commons.SendThongBao(10, "TRAO_DOI_THONG_TIN", ticketId, "", _dapper.GetDbconnection().ConnectionString, guithem);
                }
                else
                {
                    Commons.SendThongBao(9, "TRAO_DOI_THONG_TIN", ticketId, "", _dapper.GetDbconnection().ConnectionString, guithem);
                }
                return res;
            }
            catch (Exception ex)
            {
                return new ResponseViewModel()
                {
                    MA = -1
                };
            }
        }


        public List<CapNhatCa> CapNhatCa(DateTime TN, DateTime DN)
        {
            DateTime TNgay = TN;
            DateTime DNgay = DN;
            List<DateTime> ListNgay = new List<DateTime>();
            ListNgay.Add(TN.AddDays(-1));
            //lấy tất cả các ngày có trong list
            do
            {
                ListNgay.Add(TN);
                TN = TN.AddDays(1);
            } while (TN.Date <= DN.Date);
            List<CapNhatCa> listResulst = new List<CapNhatCa>();
            for (int i = 0; i < ListNgay.Count; i++)
            {
                //lấy các ca của ngày hôm đó
                List<CapNhatCa> listCA = new List<CapNhatCa>();
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "GET_CA");
                p.Add("@dCot1", ListNgay[i]);
                listCA = _dapper.GetAll<CapNhatCa>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                if (ListNgay.Count() == 2 && listCA.Where(x => TNgay >= x.NGAY_BD && DNgay <= x.NGAY_KT).ToList().Count() == 1)
                {
                    var item = listCA.Where(x => TNgay >= x.NGAY_BD && DNgay <= x.NGAY_KT).FirstOrDefault();
                    item.NGAY_KT = DNgay;
                    item.NGAY_BD = TNgay;
                    listResulst.Add(item);
                    return listResulst;
                }
                //listCA = listCA.Where(x => TNgay >= x.NGAY_BD && DNgay <= x.NGAY_KT).ToList();
                //ngày bắc đầu nằm trong ca
                foreach (var item in listCA.Where(x => x.NGAY_BD <= DNgay))
                {
                    //kiểm tra từ ngày có nằm trong item không
                    if (TNgay >= item.NGAY_BD && TNgay < item.NGAY_KT)
                    {
                        //kiểm tra đến ngày có nhỏ hơn ngày kết thúc không
                        if (DN > item.NGAY_KT)
                        {
                            // Đến ngày lớn hơn ngày kết thúc
                            item.NGAY_BD = TNgay;
                            listResulst.Add(item);
                            TNgay = item.NGAY_KT;
                        }
                        else
                        {
                            // Đến ngày nhỏ hơn ngày kết thúc
                            item.NGAY_KT = DN;
                            listResulst.Add(item);
                            break;
                        }
                    }
                }
            }
            return listResulst;
        }

        public ResponseViewModel SaveInputCauseOfDamageList(string ticketId, int msnn, DateTime tungay, DateTime denngay, string json, string Username)
        {
            try
            {

                var p = new DynamicParameters();
                //delete thời gian ngừng máy
                p.Add("@sDanhMuc", "DELETE_NGUNG_MAY");
                p.Add("@sCot1", ticketId);
                _dapper.Execute<ResponseViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);

                //save thời gian ngừng máy
                List<CapNhatCa> Resulst = CapNhatCa(tungay, denngay);
                int n = Resulst.Count;
                foreach (var item1 in Resulst)
                {
                    p.Add("@sDanhMuc", "ADD_NGUNG_MAY");
                    p.Add("@sCot1", ticketId);
                    p.Add("@iCot1", msnn);
                    p.Add("@dCot1", n == 1 ? tungay : item1.NGAY_BD);
                    p.Add("@dCot2", n == 1 ? denngay : item1.NGAY_KT);
                    p.Add("@UserName", Username);
                    _dapper.Execute<ResponseViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                }
                if (json != "")
                {
                    p.Add("@sDanhMuc", CategoryType.SAVE_LISTWO_FAILRULE_ANALYSIS.ToString());
                    p.Add("@sCot1", ticketId);
                    p.Add("@json", json);
                    _dapper.Execute<ResponseViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                }
                return new ResponseViewModel()
                {
                    MA = 1
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

        public BaseResponseModel SaveAcceptMaintenance(string username, AcceptWorkOrderModel model, int languages)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "ACCEPTANCE_WORDORDER");
                p.Add("@UserName", username);
                p.Add("@sCot1", model.MS_PHIEU_BAO_TRI);
                p.Add("@sCot2", model.TT_SAU_BT);
                p.Add("@fCot1", model.CHI_PHI_KHAC);
                p.Add("@NNgu", languages);
                var res = _dapper.Execute<BaseResponseModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                Commons.SendThongBao(13, "NGHIEM_THU_PBT", model.MS_PHIEU_BAO_TRI, "", _dapper.GetDbconnection().ConnectionString, username);
                return res;
            }
            catch
            {
                return new BaseResponseModel();
            }
        }

        public BaseResponseModel NoAcceptMaintenance(string username, AcceptWorkOrderModel model, int languages)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "NO_ACCEPTANCE_WORDORDER");
                p.Add("@UserName", username);
                p.Add("@sCot1", model.MS_PHIEU_BAO_TRI);
                p.Add("@sCot2", model.TT_SAU_BT);
                p.Add("@fCot1", model.CHI_PHI_KHAC);
                p.Add("@NNgu", languages);
                var res = _dapper.Execute<BaseResponseModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                Commons.SendThongBao(10, "TRAO_DOI_THONG_TIN", model.MS_PHIEU_BAO_TRI, "", _dapper.GetDbconnection().ConnectionString, username);
                return res;
            }
            catch
            {
                return new BaseResponseModel();
            }
        }

        public BaseResponseModel SaveThoiGianNgungMay(string username, string mspbt, string json)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "SAVE_THOI_GIAN_NGUNG_MAY");
                p.Add("@UserName", username);
                p.Add("@sCot1", mspbt);
                p.Add("@json", json);
                var res = _dapper.Execute<BaseResponseModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res;
            }
            catch
            {
                return new BaseResponseModel();
            }
        }

        public bool CheckPhuTung(string ticketId)
        {
            int n = Convert.ToInt32(SqlHelper.ExecuteScalar(_dapper.GetDbconnection().ConnectionString, CommandType.Text, "SELECT COUNT(*) FROM dbo.PHIEU_BAO_TRI_CONG_VIEC_PHU_TUNG WHERE MS_PHIEU_BAO_TRI ='" + ticketId + "'"));
            if (n == 0)
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        public BaseResponseModel UpdateTinhTrang(string ticketId)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "UPATE_TINHTRANG_HOANTHANH");
                p.Add("@sCot1", ticketId);
                var res = _dapper.Execute<BaseResponseModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res;
            }
            catch
            {
                return new BaseResponseModel();
            }
        }

        public List<ThoiGianNgungMayModel> GetListThoiGianNgungMay(string mspbt, int languages)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "GET_LIST_THOI_GIAN_MGUNG_MAY");
                p.Add("@sCot1", mspbt);
                List<ThoiGianNgungMayModel>? res = _dapper.GetAll<ThoiGianNgungMayModel>("spCMMSWEB", p, CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public BaseResponseModel SaveImagePBT(string path, string ticketId, string com, string work)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "UPDATE_IMAGE_PBT");
                p.Add("@sCot1", ticketId);
                p.Add("@sCot2", com);
                p.Add("@sCot3", path);
                p.Add("@iCot1", work);
                var res = _dapper.Execute<BaseResponseModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res;
            }
            catch
            {
                return new BaseResponseModel();
            }
        }

        public List<Thongtintraodoi> GetThongtinTraoDoi(string mspbt)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "GET_THONG_TIN_TRAO_DOI");
                p.Add("@sCot1", mspbt);
                List<Thongtintraodoi>? res = _dapper.GetAll<Thongtintraodoi>("spCMMSWEB", p, CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public List<NoAcceptWorkOrderModel> GetListPhieuBaoTriKhongChapNhan(string mspbt)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "GET_PHIEU_BAO_TRI_KHONG_NT");
                p.Add("@sCot1", mspbt);
                List<NoAcceptWorkOrderModel>? res = _dapper.GetAll<NoAcceptWorkOrderModel>("spCMMSWEB", p, CommandType.StoredProcedure);


                return res;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

    }
}
