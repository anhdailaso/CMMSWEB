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
                p.Add("@deviceID", deviceId);
                p.Add("@UserName", userName);

                var res = _dapper.GetAll<WorkOrderDetailViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                if (res != null)
                {
                    var lst = res.GroupBy(
                        x => (x.MS_CV, x.MO_TA_CV),
                        (key, data) => new { MS_CV = key.MS_CV, MO_TA_CV = key.MO_TA_CV, WorkOrderDetailViewModels = data }).ToList();

                    var workOrders = lst.Select(x =>
                    new WorkOrdersViewModel()
                    {
                        MS_CV = x.MS_CV,
                        MO_TA_CV = x.MO_TA_CV,
                        WorkOrderDetailViewModels = x.WorkOrderDetailViewModels.Select(x => new WorkOrderDetailViewModel()
                        {
                           MS_PT = x.MS_PT,
                           MS_VI_TRI_PT = x.MS_VI_TRI_PT,
                           TEN_PT = x.TEN_PT,
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
                return res;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public IEnumerable<CauseOfDamageListViewModel> GetViewCauseOfDamageList(string deviceId)
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
                        (key, data) => new CauseOfDamageListViewModel
                        { 
                            CLASS_CODE = key.CLASS_CODE, 
                            CLASS_ID = key.CLASS_ID, 
                            CLASS_NAME = key.CLASS_NAME,
                            CauseOfDamageViewModels = data.GroupBy(c => (c.CAUSE_ID, c.CAUSE_NAME, c.CAUSE_CODE), (key, data) => new CauseOfDamageViewModel
                            {
                                CAUSE_ID = key.CAUSE_ID,
                                CAUSE_CODE = key.CAUSE_CODE,
                                CAUSE_NAME = key.CAUSE_NAME,
                                RemedialViewModels = data.Select(r => new RemedialViewModel
                                {
                                    REMEDY_CODE = r.REMEDY_CODE,
                                    REMEDY_ID = r.REMEDY_ID,
                                    REMEDY_NAME = r.REMEDY_NAME
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

        public IEnumerable<CauseOfDamageListViewModel> GetInputCauseOfDamageList(string ticketId, string deviceId)
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
                        (key, data) => new CauseOfDamageListViewModel
                        {
                            CLASS_CODE = key.CLASS_CODE,
                            CLASS_ID = key.CLASS_ID,
                            CLASS_NAME = key.CLASS_NAME,
                            CauseOfDamageViewModels = data.GroupBy(c => (c.CAUSE_ID, c.CAUSE_NAME, c.CAUSE_CODE), (key, data) => new CauseOfDamageViewModel
                            {
                                CAUSE_ID = key.CAUSE_ID,
                                CAUSE_CODE = key.CAUSE_CODE,
                                CAUSE_NAME = key.CAUSE_NAME,
                                RemedialViewModels = data.Select(r => new RemedialViewModel
                                {
                                    REMEDY_CODE = r.REMEDY_CODE,
                                    REMEDY_ID = r.REMEDY_ID,
                                    REMEDY_NAME = r.REMEDY_NAME
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
    }
}
