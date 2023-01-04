﻿using Microsoft.AspNetCore.Mvc;

namespace VietSoft.CMMS.Web.Controllers
{
    public class CameraController : BaseController
    {
        public IActionResult CamareaScanner()
        {
            return PartialView("_cameraScanner");
        }
        public IActionResult LoadImage()
        {
            return PartialView("_loadimage");
        }
    }
}
