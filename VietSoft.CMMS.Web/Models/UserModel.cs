namespace VietSoft.CMMS.Web.Models
{
    public class UserModel
    {
        public string Token { get; set; }
        public string UserName { get; set; }
        public string EmployeeCodeFull { get; set; }
        public int Res { get; set; }
        public string Avatar { get; set; }
        public string FullName { get; set; }
        public DateTime StartDate { get; set; }
        public string Department { get; set; }
        public string Group { get; set; }
        public string Position { get; set; }
        public int PositionCategory { get; set; }
        public int TotalRequestPending { get; set; }
        public bool RememberMe { get; set; }
        public string Email { get; set; }
        public int EmployeeId { get; set; }
    }
}
