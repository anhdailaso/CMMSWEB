namespace VietSoft.CMMS.Web
{
    public static class Commons
    {
        public static bool CheckTimeOverlap(List<Tuple<DateTime, DateTime>> timeList)
        {
            // Sắp xếp danh sách theo thời gian bắt đầu của mỗi khoảng thời gian
            timeList.Sort((x, y) => x.Item1.CompareTo(y.Item1));

            // Kiểm tra xem có khoảng thời gian nào bắt đầu trước khi khoảng thời gian trước đó kết thúc không
            for (int i = 0; i < timeList.Count - 1; i++)
            {
                if (timeList[i + 1].Item1 < timeList[i].Item2)
                {
                    return true;
                }
            }
            return false;
        }
    }
}
