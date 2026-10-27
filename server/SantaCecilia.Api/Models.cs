namespace SantaCecilia.Api;

public enum BatchStage
{
    Planned,
    Fermenting,
    Conditioning,
    Ready,
    Archived
}

public sealed record Batch(
    int Number,
    string Name,
    string Style,
    decimal? Abv,
    int? Ibu,
    string Color,
    BatchStage Stage,
    DateOnly? BrewedOn,
    DateOnly? PackagedOn,
    DateOnly? PlannedFor,
    string? Notes);

public sealed record BrewEvent(
    string Id,
    string Name,
    DateOnly? Date,
    string Month,
    string? StartTime,
    string? EndTime,
    string? Venue,
    string? Address,
    string? Booth,
    string? Tickets,
    string? Url,
    int[] Pouring);

public sealed record LogEntry(
    int Number,
    DateOnly Date,
    string Tag,
    string Title,
    string Excerpt);

public sealed record SiteInfo(
    string BrewerName,
    string Town,
    int? BrewingSince,
    int? BatchSizeGallons,
    DateOnly? NextBrewDay,
    string BrewerStory,
    string BrewerQuote);

public sealed record Content(
    SiteInfo Site,
    List<Batch> Batches,
    List<BrewEvent> Events,
    List<LogEntry> Logbook);

public sealed record SiteSummary(
    SiteInfo Site,
    int BatchesBrewed,
    int StylesTried,
    DateOnly? UpdatedOn);

public sealed record EventView(BrewEvent Event, IReadOnlyList<Batch> Pours);

public sealed record SubscribeRequest(string? Email);
