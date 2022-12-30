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

        public UserModel GetProfile(string emplyeeCode, string token)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@NNgu", emplyeeCode);
                p.Add("@UName", token);
                var res = _dapper.Execute<UserModel>("spWThongTin", p, System.Data.CommandType.StoredProcedure);
                return res;
            }
            catch (Exception ex)
            {
                return new UserModel();
            }
        }

    }
}
