using Dapper;
using System.Data;
using System.Data.Common;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Http;

namespace VietSoft.CMMS.Web.Services
{
    public class DapperService : VietSoft.CMMS.Web.IServices.IDapperService
    {


        public string _connectionstring;
        private readonly IConfiguration _config;
        public DapperService(IConfiguration config, IHttpContextAccessor httpContext)
        {
            _config = config;
            string connString = httpContext.HttpContext.Session.GetString("ConnectionString");

            if (string.IsNullOrEmpty(connString))
            {
                string? dbEncrypt = httpContext.HttpContext.Request.Cookies["Database"];
                string database = string.IsNullOrEmpty(dbEncrypt) ? _config["ConnectionStrings:DatabaseDefault"] : MaHoamd5.MaHoamd5.Decrypt(dbEncrypt, true);
                string connStringTemplate = MaHoamd5.MaHoamd5.Decrypt(_config["ConnectionStrings:CMMSConnection"], true);
                connString = string.Format(connStringTemplate, database);
                httpContext.HttpContext.Session.SetString("ConnectionString", connString);
            }
            connString = connString.Replace("\"", string.Empty);
            _connectionstring = connString;
        }

        public void Dispose()
        {

        }

        public T? Execute<T>(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure)
        {
            using IDbConnection db = new SqlConnection(_connectionstring);
            var res = db.QueryAsync<T>(sp, parms, commandType: CommandType.StoredProcedure).Result.FirstOrDefault();
            return res;
        }

        public async Task QueryMultipleAsync(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure, Action<SqlMapper.GridReader> action = null)
        {
            using IDbConnection db = new SqlConnection(_connectionstring);
            var a = await db.QueryMultipleAsync(sp, parms, commandType: commandType);

            action?.Invoke(a);
        }

        public T? Get<T>(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure)
        {
            using IDbConnection db = new SqlConnection(_connectionstring);
            return db.Query<T>(sp, parms, commandType: commandType).FirstOrDefault();
        }

        public List<T> GetAll<T>(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure)
        {
            using IDbConnection db = new SqlConnection(_connectionstring);
            return db.Query<T>(sp, parms, commandType: commandType).ToList();
        }

        public DbConnection GetDbconnection()
        {
            return new SqlConnection(_connectionstring);
        }

        public void ExecuteNonQuery(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure)
        {
            using IDbConnection db = new SqlConnection(_connectionstring);
            db.Execute(sp, parms, commandType: commandType);
        }
 

        //protected APIExcute _apiExcute;
        //protected HRMApiUrl _hrmApiUrl { get; set; }
        //protected EmailConfiguration _emailConfig { get; set; }

        //public ServiceBase(IConfiguration configuration)
        //{
        //    _apiExcute = new APIExcute(AuthenticationType.Bearer);
        //    _hrmApiUrl = configuration.GetSection("HRMApiUrl").Get<HRMApiUrl>();
        //    _emailConfig = configuration.GetSection("EmailConfiguration").Get<EmailConfiguration>();
        //}


    }
}
