using System.Text.Json;

namespace SantaCecilia.Api;

/// <summary>
/// Reads the site's content from Data/content.json. The file is re-read whenever it
/// changes, so updating a batch or event only means editing that file — no rebuild.
/// </summary>
public sealed class ContentStore(IWebHostEnvironment env, JsonSerializerOptions json)
{
    private readonly string _path = Path.Combine(env.ContentRootPath, "Data", "content.json");
    private readonly Lock _gate = new();
    private Content? _cached;
    private DateTime _cachedStamp;

    public Content Get()
    {
        var stamp = File.GetLastWriteTimeUtc(_path);
        lock (_gate)
        {
            if (_cached is null || stamp != _cachedStamp)
            {
                using var stream = File.OpenRead(_path);
                _cached = JsonSerializer.Deserialize<Content>(stream, json)
                    ?? throw new InvalidOperationException($"{_path} is empty.");
                _cachedStamp = stamp;
            }
            return _cached;
        }
    }
}
