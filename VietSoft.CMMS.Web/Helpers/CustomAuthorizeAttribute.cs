using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace VietSoft.CMMS.Web.Helpers
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class CustomAuthorizeAttribute : Attribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            if (context.ActionDescriptor.EndpointMetadata.OfType<AllowAnonymousAttribute>().Any())
            {
                return;
            }
            else
            {
                //var str = context.HttpContext.Session.GetString("UserObject");
                //var user = !string.IsNullOrEmpty(str) ? JsonConvert.DeserializeObject<UserModel>(str) : null;
                Models.UserModel? user = SessionManager.CurrentUser;
                bool isRememberMeCookies = Convert.ToBoolean(context.HttpContext.Request.Cookies["IS_REMEMBER_ME"]);
                if (isRememberMeCookies)
                {
                    return;
                }
                else
                {
                    if (string.IsNullOrEmpty(user.UserName))
                    {
                        string url = context.HttpContext.Request.Path;
                        context.Result = new RedirectToActionResult("Login", "Account", new { returnUrl = url });
                        return;
                    }
                }

            }

        }
    }
}
