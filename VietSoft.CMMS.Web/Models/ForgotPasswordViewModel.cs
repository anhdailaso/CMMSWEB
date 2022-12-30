using System.ComponentModel.DataAnnotations;
using VietSoft.CMMS.Web.Resources;

namespace VietSoft.CMMS.Web.Models
{
    public class ForgotPasswordViewModel
    {
        [Required(ErrorMessageResourceType = typeof(Message), ErrorMessageResourceName = "FIELD_REQUIRED")]
        [Display(Name = "username")]
        public string UserName { get; set; }
        
    }
}
