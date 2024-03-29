﻿using Microsoft.Extensions.DependencyInjection.Extensions;
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
        }
    }
}
