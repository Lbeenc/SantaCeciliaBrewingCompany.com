using System.Net.Mail;
using System.Text.Json;

namespace SantaCecilia.Api;

/// <summary>
/// Keeps batch-alert sign-ups in App_Data/subscribers.json (one entry per address).
/// </summary>
public sealed class SubscriberStore(IWebHostEnvironment env)
{
    private readonly string _path = Path.Combine(env.ContentRootPath, "App_Data", "subscribers.json");
    private readonly SemaphoreSlim _gate = new(1, 1);

    public sealed record Subscriber(string Email, DateTimeOffset SignedUpAt);

    public static bool TryNormalize(string? input, out string email)
    {
        email = "";
        if (string.IsNullOrWhiteSpace(input) || input.Length > 254) return false;
        if (!MailAddress.TryCreate(input.Trim(), out var address)) return false;
        email = address.Address.ToLowerInvariant();
        return true;
    }

    /// <returns>false when the address was already on the list.</returns>
    public async Task<bool> AddAsync(string email, CancellationToken ct)
    {
        await _gate.WaitAsync(ct);
        try
        {
            var list = await ReadAsync(ct);
            if (list.Any(s => s.Email == email)) return false;

            list.Add(new Subscriber(email, DateTimeOffset.UtcNow));
            Directory.CreateDirectory(Path.GetDirectoryName(_path)!);
            var temp = _path + ".tmp";
            await File.WriteAllTextAsync(temp, JsonSerializer.Serialize(list, new JsonSerializerOptions { WriteIndented = true }), ct);
            File.Move(temp, _path, overwrite: true);
            return true;
        }
        finally
        {
            _gate.Release();
        }
    }

    private async Task<List<Subscriber>> ReadAsync(CancellationToken ct)
    {
        if (!File.Exists(_path)) return [];
        await using var stream = File.OpenRead(_path);
        return await JsonSerializer.DeserializeAsync<List<Subscriber>>(stream, cancellationToken: ct) ?? [];
    }
}
