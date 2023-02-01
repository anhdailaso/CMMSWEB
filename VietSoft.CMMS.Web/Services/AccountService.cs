using Dapper;
using VietSoft.CMMS.Web.Resources;
using VietSoft.CMMS.Web.IServices;
using VietSoft.CMMS.Web.Models;
using VietSoft.CMMS.Web.Serilog;
using Microsoft.AspNetCore.DataProtection.KeyManagement;

namespace VietSoft.CMMS.Web.Services
{
    public class AccountService :  IAccountService
    {
        private readonly IDapperService _dapper;
        private readonly ILogger<AccountService> _logger;
        public AccountService(IDapperService dapper)
        {
            _dapper = dapper;
        }
        public int Login(string userName, string passWord)
        {
            try
            {
                string? passwordEncrypt = MaHoamd5.MaHoamd5.Encrypt(passWord, true);
                string sql = $"SELECT 1";

                return _dapper.Get<int>(sql, null, System.Data.CommandType.Text);
            }
            catch (Exception ex)
            {
                CommonLogger.LogError(_logger, userName, ex, "Loggin Error");
                return 0;
            }
        }

        public UserModel GetProfile(string userName)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "GETPROFILE");
                p.Add("@UserName", userName);
                var res = _dapper.Execute<UserModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return new UserModel();
            }
        }

        public ThongTinChungViewModel GetThongTinChung(string userName)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@sDanhMuc", "GENERAL");
                p.Add("@UserName", userName);
                var res = _dapper.Execute<ThongTinChungViewModel>("spCMMSWEB", p, System.Data.CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return new ThongTinChungViewModel();
            }
        }

    }
}
