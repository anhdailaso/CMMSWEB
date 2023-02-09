using Dapper;
using System.Data;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Models;
using VietSoft.CMMS.Web.Models.Maintenance;

namespace VietSoft.CMMS.Web.Services
{
    public class MaintenanceService : IMaintenanceService
    {
        private readonly IDapperService _dapper;
        public MaintenanceService(IDapperService dapper)
        {
            _dapper = dapper;
        }

        public List<AcceptMaintenanceViewModel> GetListAcceptMaintenance(string username, int languages, DateTime? tngay, DateTime? dngay)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "Maintenance");
                p.Add("@iLoai", 2);
                p.Add("@TNgay", "01/01/2022");
                p.Add("@DNgay", "01/01/2022");
                p.Add("@UName", username);
                p.Add("@MS_MAY","");
                p.Add("@MS_BP", "");
                p.Add("@MS_PT", "");
                p.Add("@NNgu", languages);
                p.Add("@bCOT1", "");

                //int TotalRows = p.Get<int>("@TotalRows");
                List<AcceptMaintenanceViewModel>? res = _dapper.GetAll<AcceptMaintenanceViewModel>("spWBaoTri", p, CommandType.StoredProcedure);
                return res;
            }
            catch
            {
                return null;
            }
        }

        public TicketMaintenanceViewModel GetTicketMaintenanceByDevice(string userName, string deviceId, bool isNewTicket)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", CategoryType.GET_WORDORDER.ToString());
                p.Add("@deviceID", deviceId);
                p.Add("@UserName", userName);
                p.Add("@bCot1", !isNewTicket);

                var res =  _dapper.Execute<TicketMaintenanceViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);

                return res ?? new TicketMaintenanceViewModel();

            }
            catch (Exception ex)
            {
                return new TicketMaintenanceViewModel();
            }
        }

        public IEnumerable<WorkOrdersViewModel> GetWorkOrderList(string userName, string deviceId, string ticketId)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", CategoryType.GET_WORDORDER_DETAILS.ToString());
                p.Add("@sCot1", ticketId);
                p.Add("@deviceID", deviceId);
                p.Add("@UserName", userName);

                var res = _dapper.GetAll<WorkOrderDetailViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                if (res != null)
                {
                    var lst = res.GroupBy(
                        x => (x.MS_CV, x.MO_TA_CV, x.MS_BO_PHAN),
                        (key, data) => new { MS_CV = key.MS_CV, MO_TA_CV = key.MO_TA_CV, MS_BO_PHAN = key.MS_BO_PHAN, WorkOrderDetailViewModels = data }).ToList();

                    var workOrders = lst.Select(x =>
                    new WorkOrdersViewModel()
                    {
                        MS_BO_PHAN = x.MS_BO_PHAN,
                        MS_CV = x.MS_CV,
                        MO_TA_CV = x.MO_TA_CV,
                        WorkOrderDetailViewModels = x.WorkOrderDetailViewModels.Where(x => !string.IsNullOrEmpty(x.MS_PT)).Select(x => new WorkOrderDetailViewModel()
                        {
                           MS_PT = x.MS_PT,
                           MS_VI_TRI_PT = x.MS_VI_TRI_PT,
                           TEN_PT = x.TEN_PT,
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

        public IEnumerable<WorkOrderDetailViewModel> GetJobList(string userName, string deviceId, string ticketId)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", CategoryType.GET_LIST_JOB.ToString());
                p.Add("@sCot1", ticketId);
                p.Add("@deviceID", deviceId);
                p.Add("@UserName", userName);

                var res = _dapper.GetAll<WorkOrderDetailViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public IEnumerable<SuppliesViewModel> GetSuppliesList(string userName, string deviceId, string deptId, string ticketId)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", CategoryType.GET_LIST_SPAREPART.ToString());
                p.Add("@deviceID", deviceId);
                p.Add("@sCot1", ticketId);
                p.Add("@sCot2", deptId);
                p.Add("@UserName", userName);

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
                    //TODO SEACH BY KEYWORK

                    var lst = res.GroupBy(
                        x => (x.PROBLEM_CODE, x.PROBLEM_ID, x.PROBLEM_NAME),
                        (key, data) => new TreeViewModel
                        { 
                            ItemCode = key.PROBLEM_CODE, 
                            Id = key.PROBLEM_ID, 
                            ItemName = key.PROBLEM_NAME,
                            Childs = data.GroupBy(c => (c.CAUSE_ID, c.CAUSE_NAME, c.CAUSE_CODE), (key, data) => new
                            {
                                Id = key.CAUSE_ID,
                                ItemCode = key.CAUSE_CODE,
                                ItemName = key.CAUSE_NAME,
                                Childs = data.Select(r => new
                                {
                                    ItemCode = r.REMEDY_CODE,
                                    Id = r.REMEDY_ID,
                                    ItemName = r.REMEDY_NAME
                                })
                            }).ToList()
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
                        x => (x.PROBLEM_CODE, x.PROBLEM_ID, x.PROBLEM_NAME),
                        (key, data) => new TreeViewModel
                        {
                            ItemCode = key.PROBLEM_CODE,
                            Id = key.PROBLEM_ID,
                            ItemName = key.PROBLEM_NAME,
                            Childs = data.GroupBy(c => (c.CAUSE_ID, c.CAUSE_NAME, c.CAUSE_CODE), (key, data) => new
                            {
                                Id = key.CAUSE_ID,
                                ItemCode = key.CAUSE_CODE,
                                ItemName = key.CAUSE_NAME,
                                Childs = data.Select(r => new
                                {
                                    ItemCode = r.REMEDY_CODE,
                                    Id = r.REMEDY_ID,
                                    ItemName = r.REMEDY_NAME
                                })
                            }).ToList()
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
             
                return res != null ? res  : new ResponseViewModel()
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
                if(res != null)
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

        public ResponseViewModel SaveWorkOrder(string ticketId, DateTime date, int categoryTicketId, int priorityId, string statusDevice, string userName, string deviceId)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", CategoryType.SAVE_WORDORDER.ToString());
                p.Add("@sCot1", ticketId);
                p.Add("@dCot1", date);
                p.Add("@iCot1", categoryTicketId);
                p.Add("@iCot2", priorityId);
                p.Add("@sCot3", statusDevice);
                p.Add("@UserName", userName);
                p.Add("@deviceID", deviceId);

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

        public ResponseViewModel CompletedWorkOrder(string ticketId, string userName, string deviceId)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", CategoryType.COMPLETE_WORDORDER.ToString());
                p.Add("@sCot1", ticketId);
                p.Add("@UserName", userName);
                p.Add("@deviceID", deviceId);

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

        public ResponseViewModel SaveInputCauseOfDamageList(string ticketId, string json)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", CategoryType.SAVE_LISTWO_FAILRULE_ANALYSIS.ToString());
                p.Add("@sCot1", ticketId);
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
    }
}
