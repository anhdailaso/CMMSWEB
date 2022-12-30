using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace VietSoft.CMMS.Web.Serilog
{
    public static class CommonLogger
    {
        /// <summary>
        /// Write inoformation initial log
        /// </summary>
        /// <param name="log"></param>
        /// <param name="name"></param>
        /// <param name="stopWatch"></param>
        public static void LogInitialized(ILogger log, string name, Stopwatch stopWatch)
        {
            stopWatch.Start();
            log.LogInformation($"Initialized: {name}.");
        }

        /// <summary>
        /// Write inoformation start log
        /// </summary>
        /// <param name="log"></param>
        /// <param name="T"></param>
        /// <param name="message"></param>
        public static void LogStart<T>(ILogger log, T customDataLogging, string message = "")
        {
            log.LogInformation(customDataLogging, $"Start: {message}.");
        }

        /// <summary>
        /// Write inoformation start log
        /// </summary>
        /// <param name="log"></param>
        /// <param name="stopWatch"></param>
        /// <param name="customDataLogging"></param>
        /// <param name="message"></param>
        public static void LogStart<T>(ILogger log, T customDataLogging, Stopwatch stopWatch, string message = "")
        {
            stopWatch.Start();
            log.LogInformation(customDataLogging, $"Start: {message}.  Start: Time ellapsed={stopWatch.Elapsed}.");
        }

        /// <summary>
        /// Start log information
        /// </summary>
        /// <param name="className"></param>
        /// <param name="log"></param>
        /// <param name="customDataLogging"></param>
        /// <param name="stopWatch"></param>
        /// <param name="methodName"></param>
        public static void LogStart<T>(string className, ILogger log, T customDataLogging, Stopwatch stopWatch, [CallerMemberName] string methodName = "")
        {
            stopWatch.Start();
            log.LogInformation(customDataLogging, $"{className}_{methodName} Start: Time ellapsed={stopWatch.Elapsed}.");
        }

        /// <summary>
        /// Start log information
        /// </summary>
        /// <param name="className"></param>
        /// <param name="log"></param>
        /// <param name="customDataLogging"></param>
        /// <param name="methodName"></param>
        public static void LogStart<T>(string className, ILogger log, T customDataLogging, [CallerMemberName] string methodName = "")
        {
            log.LogInformation(customDataLogging, $"{className}_{methodName} Start");
        }

        /// <summary>
        /// Write inoformation finish log
        /// </summary>
        /// <param name="log"></param>
        /// <param name="message"></param>
        /// <param name="customDataLogging"></param>
        public static void LogFinish<T>(ILogger log, T customDataLogging, string message)
        {
            log.LogInformation(customDataLogging, $"Finish: message={message}.");
        }

        /// <summary>
        /// Write inoformation finish log
        /// </summary>
        /// <param name="log"></param>
        /// <param name="message"></param>
        /// <param name="stopWatch"></param>
        /// <param name="customDataLogging"></param>
        public static void LogFinish<T>(ILogger log, T customDataLogging, Stopwatch stopWatch, string message)
        {
            stopWatch.Stop();

            log.LogInformation(customDataLogging, $"Finish: message={message} End Time ellapsed={stopWatch.Elapsed}.");
        }

        /// <summary>
        /// Write inoformation finish log
        /// </summary>
        /// <param name="className"></param>
        /// <param name="log"></param>
        /// <param name="customDataLogging"></param>
        /// <param name="stopWatch"></param>
        /// <param name="methodName"></param>
        public static void LogFinish<T>(string className, ILogger log, T customDataLogging, Stopwatch stopWatch, [CallerMemberName] string methodName = "")
        {
            stopWatch.Stop();
            log.LogInformation(customDataLogging, $"{className}_{methodName} Finish: End Time ellapsed={stopWatch.Elapsed}.");
        }

        /// <summary>
        /// Write inoformation finish log
        /// </summary>
        /// <param name="className"></param>
        /// <param name="log"></param>
        /// <param name="customDataLogging"></param>
        /// <param name="methodName"></param>
        public static void LogFinish<T>(string className, ILogger log, T customDataLogging, [CallerMemberName] string methodName = "")
        {
            log.LogInformation(customDataLogging, $"{className}_{methodName} Finish.");
        }

        /// <summary>
        /// Write error log
        /// </summary>
        /// <param name="log"></param>
        /// <param name="customDataLogging"></param>
        /// <param name="messsage"></param>
        public static void LogError<T>(ILogger log, T customDataLogging, string messsage)
        {
            log.LogError(customDataLogging, $"Error at: message={messsage}.");
        }

        /// <summary>
        /// Write error log
        /// </summary>
        /// <param name="log"></param>
        /// <param name="customDataLogging"></param>
        /// <param name="ex"></param>
        /// <param name="messsage"></param>
        public static void LogError<T>(ILogger log, T customDataLogging, Exception ex, string messsage)
        {
            log.LogError(customDataLogging, ex, $"Error at: message={messsage}, exception = {ex}.");
        }

        /// <summary>
        /// Write information log
        /// </summary>
        /// <param name="log"></param>
        /// <param name="customDataLogging"></param>
        /// <param name="message"></param>
        public static void LogInformation<T>(ILogger log, T customDataLogging, string message)
        {
            log.LogInformation(customDataLogging, $"Information: message={message}.");
        }

        /// <summary>
        /// Write Warning log
        /// </summary>
        /// <param name="log"></param>
        /// <param name="customDataLogging"></param>
        /// <param name="message"></param>
        public static void LogWarning<T>(ILogger log, T customDataLogging, string message)
        {
            log.LogWarning(customDataLogging, $"Warning: message={message}.");
        }
    }
}
