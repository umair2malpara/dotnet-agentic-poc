using DotnetAgenticPoc.Api.Models;

namespace DotnetAgenticPoc.Api.Contracts;

public sealed class PagedCustomersResult
{
    public required IReadOnlyCollection<Customer> Items { get; init; }

    public required int Page { get; init; }

    public required int PageSize { get; init; }

    public required int TotalCount { get; init; }
}
