using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VietSoft.CMMS.Web.IServices;

namespace VietSoft.CMMS.Web.Controllers
{

    public class MoveDeviceController : BaseController
    {
        private readonly ILogger<MoveDeviceController> _logger;
        private readonly IAccountService _accountService;
        private readonly IComboboxService _combobox;
        private readonly IMaintenanceService _maintenance;


        public MoveDeviceController(ILogger<MoveDeviceController> logger, IAccountService accountService, IComboboxService combobox,IMaintenanceService maintenance)
        {
            _logger = logger;
            _accountService = accountService;
            _combobox = combobox;
            _maintenance = maintenance;
        }

        [AllowAnonymous]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Index()
        {
            return View();
        }
    }
}
