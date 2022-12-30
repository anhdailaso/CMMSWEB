using System.ComponentModel.DataAnnotations;
using VietSoft.CMMS.Web.Resources;

namespace VietSoft.CMMS.Web.Models
{
    public class ChangePasswordViewModel
    {
        public string? UserName { get; set; }
        [Required(ErrorMessageResourceType = typeof(Message), ErrorMessageResourceName = "FIELD_REQUIRED")]
        [Display(Name = "password")]
        public string Password { get; set; }
        [Required(ErrorMessageResourceType = typeof(Message), ErrorMessageResourceName = "FIELD_REQUIRED")]
        [Display(Name = "password")]
        public string PasswordNew { get; set; }
        [Required(ErrorMessageResourceType = typeof(Message), ErrorMessageResourceName = "FIELD_REQUIRED")]
        [Display(Name = "password")]
        public string PasswordConfirm { get; set; }
    }
}
