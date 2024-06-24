using Serilog;
using Serilog.Events;
using VietSoft.CMMS.Web.Extensions;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Serilog;
using VietSoft.CMMS.Web.Services;

WebApplicationBuilder? builder = WebApplication.CreateBuilder(args);

// Add services to the container.
Serilog.Core.Logger? logger = new LoggerConfiguration()
    .MinimumLevel.Override("System", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .WriteTo.Logger(lc => lc.Filter.ByIncludingOnly(evt => evt.Level >= LogEventLevel.Warning))
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.WithMessageTemplate()
    .CreateLogger();

builder.Logging.ClearProviders();
builder.Logging.AddSerilog(logger);

builder.Services.AddControllersWithViews();
builder.Services.AddDistributedMemoryCache();
//builder.WebHost.UseUrls("http://192.168.2.6:5000");
double sessionTimeout = Convert.ToDouble(builder.Configuration["SessionTimeout"]);
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(sessionTimeout);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.AddTransient<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddTransient<IDapperService, DapperService>();
builder.Services.AddSevices();

WebApplication? app = builder.Build();
IHttpContextAccessor? s = app.Services.GetRequiredService<IHttpContextAccessor>();
SessionManager.Configure(s);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler(
       new ExceptionHandlerOptions()
       {
           //AllowStatusCode404Response = true, // important!
           ExceptionHandlingPath = "/Home/Error"
       });
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseSession();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Account}/{action=Login}/{id?}");
    //pattern: "{controller=Home}/{action=Index}/{id?}");
    app.Run();