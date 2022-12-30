namespace VietSoft.CMMS.Web.Helpers
{
    public class PagedList<T>
    {
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }

        public List<T> Data { get; set; }

        public PagedList(List<T> source, int totalItems, int page, int pageSize)
        {
            TotalItems = totalItems;
            Page = page - 1;
            PageSize = pageSize > 0 ? pageSize : 10;
            TotalPages = (int)Math.Ceiling(this.TotalItems / (double)this.PageSize);
            Data = source.Skip(Page * pageSize).Take(pageSize).ToList();
        }
    }
}
