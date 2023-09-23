namespace VietSoft.CMMS.Web.Models
{
    public class UserModel
    {
        public string Token { get; set; }
        public string UserName { get; set; }
        public byte[] HINH_CN { get; set; }
        public string Avatar { get; set; }
        public string FullName { get; set; }
        public DateTime StartDate { get; set; }
        public string Department { get; set; }
        public string Group { get; set; }
        public bool RememberMe { get; set; }
        public int TypeLangue { get; set; }
        public string Email { get; set; }
        public string MS_CONG_NHAN { get; set; }
        public bool HT_MAY_CV { get; set; }

    }
}
