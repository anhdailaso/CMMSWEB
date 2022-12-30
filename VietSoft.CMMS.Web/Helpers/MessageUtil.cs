using VietSoft.CMMS.Web.Models;

namespace VietSoft.CMMS.Web.Helpers
{
    public static class MessageUtil
    {
        public static void ShowSuccess(string message, bool isPlaySound = true)
        {
            SessionManager.Message = new MessageViewModel { Status = "success", Message = message, IsPlaySound = isPlaySound };
        }

        public static void ShowError(string message, bool isPlaySound = true)
        {
            SessionManager.Message = new MessageViewModel { Status = "error", Message = message, IsPlaySound = isPlaySound };
        }

        public static void ClearMessage()
        {
            SessionManager.Message = null;
        }
    }
}
