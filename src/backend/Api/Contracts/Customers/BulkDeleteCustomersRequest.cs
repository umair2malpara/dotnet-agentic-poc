namespace DotnetAgenticPoc.Api.Contracts.Customers;

public sealed class BulkDeleteCustomersRequest
{
    public IReadOnlyCollection<Guid>? Ids { get; init; }
}
