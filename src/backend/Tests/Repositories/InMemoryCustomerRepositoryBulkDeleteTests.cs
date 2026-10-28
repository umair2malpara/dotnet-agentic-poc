using DotnetAgenticPoc.Infrastructure.Repositories;
using Xunit;

namespace DotnetAgenticPoc.Api.Tests.Repositories;

public sealed class InMemoryCustomerRepositoryBulkDeleteTests
{
    [Fact]
    public async Task DeleteManyAsync_DeletesAllExistingDistinctIds()
    {
        var repository = new InMemoryCustomerRepository();
        var customers = await repository.GetAllAsync(CancellationToken.None);
        var ids = customers.Take(2).Select(customer => customer.Id).ToArray();

        var deleted = await repository.DeleteManyAsync(
            [ids[0], ids[0], ids[1]],
            CancellationToken.None);
        var remaining = await repository.GetAllAsync(CancellationToken.None);

        Assert.True(deleted);
        Assert.Equal(18, remaining.Count);
        Assert.DoesNotContain(remaining, customer => ids.Contains(customer.Id));
    }

    [Fact]
    public async Task DeleteManyAsync_WhenAnyIdIsMissing_DeletesNone()
    {
        var repository = new InMemoryCustomerRepository();
        var customersBefore = await repository.GetAllAsync(CancellationToken.None);
        var existingId = customersBefore.First().Id;

        var deleted = await repository.DeleteManyAsync(
            [existingId, Guid.NewGuid()],
            CancellationToken.None);
        var customersAfter = await repository.GetAllAsync(CancellationToken.None);

        Assert.False(deleted);
        Assert.Equal(customersBefore.Count, customersAfter.Count);
        Assert.Contains(customersAfter, customer => customer.Id == existingId);
    }

    [Fact]
    public async Task DeleteManyAsync_WhenEmpty_DeletesNone()
    {
        var repository = new InMemoryCustomerRepository();

        var deleted = await repository.DeleteManyAsync(
            [],
            CancellationToken.None);

        Assert.False(deleted);
    }

    [Fact]
    public async Task DeleteManyAsync_ConcurrentOverlappingBatchesRemainAtomic()
    {
        var repository = new InMemoryCustomerRepository();
        var ids = (await repository.GetAllAsync(CancellationToken.None))
            .Take(3)
            .Select(customer => customer.Id)
            .ToArray();

        var results = await Task.WhenAll(
            Task.Run(() => repository.DeleteManyAsync(
                [ids[0], ids[1]],
                CancellationToken.None)),
            Task.Run(() => repository.DeleteManyAsync(
                [ids[1], ids[2]],
                CancellationToken.None)));
        var remaining = await repository.GetAllAsync(CancellationToken.None);

        Assert.Single(results, deleted => deleted);
        Assert.Single(results, deleted => !deleted);
        Assert.Equal(18, remaining.Count);
        Assert.Contains(remaining, customer =>
            customer.Id == ids[0] || customer.Id == ids[2]);
    }
}
