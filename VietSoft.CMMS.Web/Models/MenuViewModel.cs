namespace VietSoft.CMMS.Web.Models
{
    public class MenuViewModel
    {
        public int MenuId { get; set; }
        public int? ParentId { get; set; }
        public string? MenuName { get; set; }
        public string? MenuIcon { get; set; }
        public string? Target { get; set; }
        public string? MenuUrl { get; set; }
        public bool IsSelected { get; set; }
    }
}
