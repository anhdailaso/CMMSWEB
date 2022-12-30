using Newtonsoft.Json;

namespace VietSoft.CMMS.Web.Extensions
{
    public static class SessionExtentions
    {

        public static void Set<T>(this ISession session, string k, T value)
        {
            session.SetString(k, JsonConvert.SerializeObject(value));
        }
        public static T Get<T>(this ISession session, string k)
        {
            var value = session.GetString(k);
            return value == null ? default(T) : JsonConvert.DeserializeObject<T>(value);
        }

        //public static void Set<T>(this ISession session, string key, T value)
        //{
        //    if (value == null)
        //    {
        //        session.Remove(key);
        //        return;
        //    }

        //    string jsonString;
        //    if (value is string)
        //    {
        //        jsonString = value as string;
        //    }
        //    else
        //    {
        //        jsonString = JsonSerializer.Serialize(value);
        //    }

        //    session.SetString(key, jsonString);
        //}

        //public static T Get<T>(this ISession session, string key, T defaultIfNull = default)
        //{
        //    var value = session.GetString(key);
        //    if (value == null)
        //    {
        //        return defaultIfNull;
        //    }

        //    if (typeof(T) == typeof(string))
        //    {
        //        return value.OfType<T>();
        //    }

        //    return JsonSerializer.Deserialize<T>(value);
        //}
    }
}
