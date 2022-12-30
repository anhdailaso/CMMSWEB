using Serilog;
using Serilog.Configuration;
using Serilog.Core;
using Serilog.Events;

namespace VietSoft.CMMS.Web.Serilog
{
    public static class LoggingExtensions
    {
        public static LoggerConfiguration WithMessageTemplate(this LoggerEnrichmentConfiguration enrichmentConfiguration)
        {
            if (enrichmentConfiguration == null)
                throw new ArgumentNullException(nameof(enrichmentConfiguration));

            return enrichmentConfiguration.With<MessageTemplateEnricher>();
        }
    }

    public class MessageTemplateEnricher : ILogEventEnricher
    {
        public void Enrich(LogEvent logEvent, ILogEventPropertyFactory propertyFactory)
        {
            logEvent.AddOrUpdateProperty(
                propertyFactory.CreateProperty("MessageTemplate", logEvent.MessageTemplate.Text)
            );
        }
    }
}
