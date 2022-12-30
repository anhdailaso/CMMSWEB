using Dapper;
using System.Data;
using System.Data.Common;

namespace VietSoft.CMMS.Web.IServices
{
    public interface IDapperService : IDisposable
    {
        DbConnection GetDbconnection();
        T? Get<T>(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure);
        List<T> GetAll<T>(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure);
        T? Execute<T>(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure);
        void ExecuteNonQuery(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure);
        Task QueryMultipleAsync(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure, Action<SqlMapper.GridReader> action = null);

    }
}
