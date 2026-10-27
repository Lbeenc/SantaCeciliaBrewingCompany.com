using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http.Json;
using SantaCecilia.Api;

var builder = WebApplication.CreateBuilder(args);

var json = new JsonSerializerOptions(JsonSerializerDefaults.Web);
json.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
builder.Services.Configure<JsonOptions>(o =>
    o.SerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase)));

builder.Services.AddSingleton(json);
builder.Services.AddSingleton<ContentStore>();
builder.Services.AddSingleton<SubscriberStore>();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

var api = app.MapGroup("/api");

api.MapGet("/site", (ContentStore store) =>
{
    var c = store.Get();
    var brewed = c.Batches.Where(b => b.Stage != BatchStage.Planned).ToList();
    var updated = c.Batches
        .SelectMany(b => new[] { b.BrewedOn, b.PackagedOn })
        .Where(d => d is not null)
        .Max();
    return new SiteSummary(
        c.Site,
        brewed.Count,
        brewed.Select(b => b.Style.Trim().ToLowerInvariant()).Distinct().Count(),
        updated);
});

api.MapGet("/batches", (ContentStore store, string? stage) =>
{
    var batches = store.Get().Batches.AsEnumerable();
    if (!string.IsNullOrEmpty(stage))
    {
        if (!Enum.TryParse<BatchStage>(stage, ignoreCase: true, out var s))
            return Results.BadRequest(new { error = $"Unknown stage '{stage}'." });
        batches = batches.Where(b => b.Stage == s);
    }
    return Results.Ok(batches.OrderByDescending(b => b.Number));
});

api.MapGet("/events", (ContentStore store) =>
{
    var c = store.Get();
    var today = DateOnly.FromDateTime(DateTime.Now);
    var views = c.Events.Select(e => new EventView(e,
        e.Pouring.Select(n => c.Batches.FirstOrDefault(b => b.Number == n))
                 .OfType<Batch>().ToList())).ToList();

    // An event with no exact date yet counts as upcoming until its month is over.
    bool IsUpcoming(BrewEvent e) => e.Date is { } d
        ? d >= today
        : DateOnly.TryParse(e.Month + "-01", out var m) && m.AddMonths(1) > today;

    return new
    {
        Upcoming = views.Where(v => IsUpcoming(v.Event)).OrderBy(v => v.Event.Date ?? DateOnly.Parse(v.Event.Month + "-01")),
        Past = views.Where(v => !IsUpcoming(v.Event)).OrderByDescending(v => v.Event.Date)
    };
});

api.MapGet("/events/{id}/calendar.ics", (ContentStore store, string id) =>
{
    var e = store.Get().Events.FirstOrDefault(x => x.Id == id);
    if (e?.Date is not { } date) return Results.NotFound();

    static string Esc(string? s) => (s ?? "").Replace("\\", "\\\\").Replace(";", "\\;").Replace(",", "\\,").Replace("\n", "\\n");
    static string Stamp(DateOnly d, string? time) =>
        TimeOnly.TryParse(time, out var t) ? $"{d:yyyyMMdd}T{t:HHmm}00" : $"{d:yyyyMMdd}";

    var allDay = !TimeOnly.TryParse(e.StartTime, out _);
    var ics = new StringBuilder()
        .AppendLine("BEGIN:VCALENDAR").AppendLine("VERSION:2.0")
        .AppendLine("PRODID:-//Santa Cecilia Brewing Co.//Events//EN")
        .AppendLine("BEGIN:VEVENT")
        .AppendLine($"UID:{e.Id}@santaceciliabrewingcompany.com")
        .AppendLine($"DTSTAMP:{DateTime.UtcNow:yyyyMMddTHHmmssZ}")
        .AppendLine(allDay ? $"DTSTART;VALUE=DATE:{Stamp(date, null)}" : $"DTSTART:{Stamp(date, e.StartTime)}")
        .AppendLine(allDay ? $"DTEND;VALUE=DATE:{Stamp(date.AddDays(1), null)}" : $"DTEND:{Stamp(date, e.EndTime ?? e.StartTime)}")
        .AppendLine($"SUMMARY:{Esc($"Santa Cecilia Brewing Co. at {e.Name}")}")
        .AppendLine($"LOCATION:{Esc(string.Join(", ", new[] { e.Venue, e.Address }.Where(s => !string.IsNullOrWhiteSpace(s))))}")
        .AppendLine("END:VEVENT").AppendLine("END:VCALENDAR")
        .ToString().Replace("\r\n", "\n").Replace("\n", "\r\n");

    return Results.File(Encoding.UTF8.GetBytes(ics), "text/calendar", $"{e.Id}.ics");
});

api.MapGet("/logbook", (ContentStore store, int? take) =>
    store.Get().Logbook.OrderByDescending(l => l.Date).Take(Math.Clamp(take ?? 50, 1, 50)));

api.MapPost("/subscribers", async (SubscribeRequest req, SubscriberStore subscribers, CancellationToken ct) =>
{
    if (!SubscriberStore.TryNormalize(req.Email, out var email))
        return Results.ValidationProblem(new Dictionary<string, string[]> { ["email"] = ["Enter a valid email address."] });

    var added = await subscribers.AddAsync(email, ct);
    return Results.Ok(new { added });
});

api.MapFallback(() => Results.NotFound());

app.MapFallbackToFile("index.html");

app.Run();
