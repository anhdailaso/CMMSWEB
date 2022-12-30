using System.Globalization;
using System.Text.RegularExpressions;

namespace VietSoft.CMMS.Web.Helpers
{
    public static class ExtendedDateTime
    {
        #region DateTime With Format

        private const string SPLIT = "_";
        private const string FORMAT = "MM/dd/yyyy HH:mm";

        public static DateTime? ToDateTimeOrDefault(this string str)
        {
            try
            {
                var dateTime = DateTime.Parse(str);
                return dateTime;
            }
            catch
            {
                return null;
            }
        }

        public static string ToStringOrDefault(this DateTime dateTime, string format = FORMAT, string split = SPLIT)
        {
            try
            {
                var dateTimeStr = dateTime.ToString(format);
                var result = $"{dateTimeStr}{split}{format}";
                return result;
            }
            catch
            {
                return null;
            }
        }

        public static string ToStringOrDefault(this DateTime? dateTime, string format = FORMAT, string split = SPLIT)
        {
            try
            {
                if (!dateTime.HasValue)
                    return null;
                var dateTimeStr = dateTime.Value.ToString(format);
                var result = $"{dateTimeStr}{split}{format}";
                return result;
            }
            catch
            {
                return null;
            }
        }

        #endregion DateTime With Format

        ///<summary>
        ///Convert DateTime? to DateTime, default value is year 0001
        ///</summary>
        public static DateTime ToDateTime(this DateTime? target)
        {
            return target.GetValueOrDefault();
        }

        ///<summary>
        ///Get current date time by UTC time zone.
        ///<param name="target">DateTime variable</param>
        ///<param name="gmtzone">The number of time zone.  Ex: for VN(UTC+7) use 7</param>
        ///</summary>
        public static DateTime ToUTCTimeZone(this DateTime target, int gmtzone)
        {
            return DateTime.UtcNow.AddHours(gmtzone);
        }

        ///<summary>
        ///Convert string to datetime, format input string "yyyyMMdd"
        ///</summary>
        public static DateTime? ToDate(this string input, string format = "yyyyMMdd")
        {
            if (string.IsNullOrEmpty(input)) return null;
            return DateTime.ParseExact(input, format, CultureInfo.CurrentCulture);
        }

        ///<summary>
        ///Convert string to datetime, format output string "dd/MM/yyyy"
        ///</summary>
        public static string ToStringDate(this DateTime? input, string format = "dd/MM/yyyy")
        {
            if (input == null)
            {
                return "";
            }
            return input?.ToString(format);
        }

        ///<summary>
        ///Convert date to text time
        ///<param name="target">DateTime variable</param>
        ///<param name="format">Time format, default is "hh:mm tt"</param>
        ///</summary>
        public static string ToTextTime(this DateTime target, string format = "HH:mm")
        {
            return target.ToString(format);
        }

        ///<summary>
        ///Conver date to text date time
        ///<param name="target">DateTime variable</param>
        ///<param name="format">DateTime format, default is "dd-MMM-yyyy hh:mm tt"</param>
        ///</summary>
        public static string ToTextDateTime(this DateTime target, string format = "dd-MM-yyyy hh:mm tt")
        {
            return target.ToString(format);
        }

        ///<summary>
        ///Convert date to text time, if null default is blank
        ///<param name="target">DateTime variable</param>
        ///<param name="format">Time format, default is "hh:mm tt"</param>
        ///</summary>
        public static string ToTextTime(this DateTime? target, string format = "HH:mm")
        {
            try
            {
                if (target == null)
                {
                    return "";
                }
                return target.Value.ToString(format);
            }
            catch (Exception)
            {
                return "";
            }
        }

        ///<summary>
        ///Convert date to text date time, if null default is blank
        ///<param name="target">DateTime variable</param>
        ///<param name="format">DateTime format, default is "dd-MMM-yyyy hh:mm tt"</param>
        ///</summary>
        public static string ToTextDateTime(this DateTime? target, string format = "dd-MMM-yyyy hh:mm tt")
        {
            try
            {
                if (!target.HasValue)
                    return "";
                return target.Value.ToString(format);
            }
            catch (Exception)
            {
                return "";
            }
        }
    }
}
