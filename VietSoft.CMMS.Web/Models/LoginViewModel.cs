using System.ComponentModel.DataAnnotations;
using VietSoft.CMMS.Web.Helpers;
using VietSoft.CMMS.Web.Resources;


namespace VietSoft.CMMS.Web.Models
{
    public class LoginViewModel
    {
        [Required(ErrorMessageResourceType = typeof(Message), ErrorMessageResourceName = "FIELD_REQUIRED")]
        [Display(Name = "username")]
        public string UserName { get; set; }

        [Required(ErrorMessageResourceType = typeof(Message), ErrorMessageResourceName = "FIELD_REQUIRED")]
        [Display(Name = "password")]
        public string Password { get; set; }

        public bool RememberMe { get; set; }

        public string? ReturnUrl { get; set; }

        public string? Avatar { get; set; }

        public string? LastName { get; set; }

        public ModuleType Module { get; set; }

        public string? Database { get; set; }
    }
}
