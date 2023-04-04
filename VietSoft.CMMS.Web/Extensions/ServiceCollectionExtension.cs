using Microsoft.Extensions.DependencyInjection.Extensions;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Services;

namespace VietSoft.CMMS.Web.Extensions
{
    public static class ServiceCollectionExtension
    {
        public static void AddSevices(this IServiceCollection services)
        {
            services.TryAddScoped<IAccountService, AccountService>();
            services.TryAddScoped<IHomeService, HomeService>();
            services.TryAddScoped<IHistoryService, HistoryService>();
            services.TryAddScoped<IHistoryRequestService, HistoryRequestService>();
            services.TryAddScoped<IComboboxService, ComboboxService>();
            services.TryAddScoped<IChartService, ChartService>();
            services.TryAddScoped<IMaintenanceService, MaintenanceService>();
            services.TryAddScoped<IDeviceService, DeviceService>();
            services.TryAddScoped<IGoodReceiptService, GoodReceiptService>();
            services.TryAddScoped<IGoodIssueService, GoodIssueService>();
        }
    }
}
