﻿using VietSoft.CMMS.Web.Models;

namespace VietSoft.CMMS.Web.IServices
{
    public interface IHistoryRequestService
    {
        List<HistoryRequestViewModel> GetListHistoryRequest(string username, int languages, DateTime? tngay, DateTime? dngay, string ms_may, int idNguoiYC, int pageIndex, int pageSize);
    }
}
