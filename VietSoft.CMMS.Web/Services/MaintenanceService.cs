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

        public TicketMaintenanceViewModel GetTicketMaintenanceByDevice(string userName, string deviceId)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", CategoryType.GET_WORDORDER.ToString());
                p.Add("@deviceID", deviceId);
                p.Add("@UserName", userName);

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
                res = new List<WorkOrderDetailViewModel>()
                {
                    new WorkOrderDetailViewModel{ MS_BO_PHAN = "04.02.01", MO_TA_CV = "Thay nhơt", MS_CV = 1, MS_PT = "BEA-02-005", MS_VI_TRI_PT = "All", SL_TT = 2 },
                    new WorkOrderDetailViewModel{ MS_BO_PHAN = "04.02.01", MO_TA_CV = "Thay nhơt", MS_CV = 1, MS_PT = "BEA-02-006", MS_VI_TRI_PT = "All", SL_TT = 2 },
                    new WorkOrderDetailViewModel{ MS_BO_PHAN = "04.02.01", MO_TA_CV = "Thay nhơt", MS_CV = 1, MS_PT = "BEA-02-007", MS_VI_TRI_PT = "All", SL_TT = 2 },

                    new WorkOrderDetailViewModel{ MS_BO_PHAN = "04.02.01", MO_TA_CV = "Bôi trơn vòng bi", MS_CV = 2, MS_PT = "BEA-02-005", MS_VI_TRI_PT = "All", SL_TT = 2 },
                    new WorkOrderDetailViewModel{ MS_BO_PHAN = "04.02.01", MO_TA_CV = "Bôi trơn vòng bi", MS_CV = 2, MS_PT = "BEA-02-005", MS_VI_TRI_PT = "All", SL_TT = 2 },
                    new WorkOrderDetailViewModel{ MS_BO_PHAN = "04.02.01", MO_TA_CV = "Bôi trơn vòng bi", MS_CV = 2, MS_PT = "BEA-02-005", MS_VI_TRI_PT = "All", SL_TT = 2 },

                    new WorkOrderDetailViewModel{ MS_BO_PHAN = "04.02.01", MO_TA_CV = "Thay bạt đạn", MS_CV = 3, MS_PT = "BEA-02-005", MS_VI_TRI_PT = "All", SL_TT = 2 },
                    new WorkOrderDetailViewModel{ MS_BO_PHAN = "04.02.01", MO_TA_CV = "Thay bạt đạn", MS_CV = 3, MS_PT = "BEA-02-005", MS_VI_TRI_PT = "All", SL_TT = 2 },
                    new WorkOrderDetailViewModel{ MS_BO_PHAN = "04.02.01", MO_TA_CV = "Thay bạt đạn", MS_CV = 3, MS_PT = "BEA-02-005", MS_VI_TRI_PT = "All", SL_TT = 2 }

                };
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
                        WorkOrderDetailViewModels = x.WorkOrderDetailViewModels.Select(x => new WorkOrderDetailViewModel()
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

        public IEnumerable<WorkOrderDetailViewModel> GetJobList(string userName, string deviceId)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", CategoryType.GET_LIST_JOB.ToString());
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

        public IEnumerable<SuppliesViewModel> GetSuppliesList(string userName, string deviceId, string deptId)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", CategoryType.GET_LIST_SPAREPART.ToString());
                p.Add("@deviceID", deviceId);
                p.Add("@sCot1", deptId);
                p.Add("@UserName", userName);

                var res = _dapper.GetAll<SuppliesViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public IEnumerable<LogWorkViewModel> GetLogWorkList(string ticketId)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", CategoryType.GET_LIST_WORKING_TIME.ToString());
                p.Add("@sCot1", ticketId);

                var res = _dapper.GetAll<LogWorkViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                res = new List<LogWorkViewModel>()
                {
                    new LogWorkViewModel(){ NGAY = DateTime.Now, DEN_NGAY =DateTime.Now, SO_GIO = 4},
                    new LogWorkViewModel(){ NGAY = DateTime.Now, DEN_NGAY =DateTime.Now, SO_GIO = 4}
                };
                return res;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public IEnumerable<TreeViewModel> GetViewCauseOfDamageList(string deviceId)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", CategoryType.GET_LIST_FAILRULE_ANALYSIS.ToString());
                p.Add("@deviceID", deviceId);

                var res = _dapper.GetAll<CauseOfDamageModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                if (res != null)
                {
                    var lst = res.GroupBy(
                        x => (x.CLASS_CODE, x.CLASS_ID, x.CLASS_NAME),
                        (key, data) => new TreeViewModel
                        { 
                            ItemCode = key.CLASS_CODE, 
                            Id = key.CLASS_ID, 
                            ItemName = key.CLASS_NAME,
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
                    lst = new List<TreeViewModel>()
                    {
                        new TreeViewModel(){ ItemName = "Ket truc", ItemCode ="01.03.05", Amount = 5, Childs = new []
                        { 
                            new {ItemName = "Thieu boi tron", ItemCode ="01.03.05.01", Amount = 5, Childs = new []
                                    { new {ItemName = "Tra dầu", ItemCode ="01.03.05.02", Amount = 5,  }, new {ItemName = "Boi mo", ItemCode ="01.03.05.03", Amount = 5} }
                                },
                            new {ItemName = "Ket di vat", ItemCode ="01.03.05.02", Amount = 5, Childs = new []
                                    { new {ItemName = "Loai bo di vat", ItemCode ="01.03.05.02", Amount = 5,  }, new {ItemName = "dieu chinh khe ngan", ItemCode ="01.03.05.03", Amount = 5} }
                                }
                        } ,

                        }
                    };
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
                        x => (x.CLASS_CODE, x.CLASS_ID, x.CLASS_NAME),
                        (key, data) => new TreeViewModel
                        {
                            ItemCode = key.CLASS_CODE,
                            Id = key.CLASS_ID,
                            ItemName = key.CLASS_NAME,
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
                    lst = new List<TreeViewModel>()
                    {
                        new TreeViewModel(){ ItemName = "Ket truc", ItemCode ="01.03.05", Amount = 5, Childs = new []
                        {
                            new {ItemName = "Thieu boi tron", ItemCode ="01.03.05.01", Amount = 5, Childs = new []
                                    { new {ItemName = "Tra dầu", ItemCode ="01.03.05.02", Amount = 5,  }, new {ItemName = "Boi mo", ItemCode ="01.03.05.03", Amount = 5} }
                                },
                            new {ItemName = "Ket di vat", ItemCode ="01.03.05.02", Amount = 5, Childs = new []
                                    { new {ItemName = "Loai bo di vat", ItemCode ="01.03.05.02", Amount = 5,  }, new {ItemName = "dieu chinh khe ngan", ItemCode ="01.03.05.03", Amount = 5} }
                                }
                        } ,

                        }
                    };
                    return lst;
                }

                return null;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
