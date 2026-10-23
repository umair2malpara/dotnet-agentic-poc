using System.Collections.Concurrent;
using DotnetAgenticPoc.Api.Contracts;
using DotnetAgenticPoc.Api.Models;

namespace DotnetAgenticPoc.Api.Repositories;

public sealed class InMemoryCustomerRepository : ICustomerRepository
{
    private readonly ConcurrentDictionary<Guid, Customer> customers = new();

    public Task<PagedCustomersResult> GetPagedAsync(
        int page,
        int pageSize,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var orderedCustomers = customers.Values
            .OrderBy(customer => customer.Name)
            .ThenBy(customer => customer.Id)
            .ToArray();

        var skippedRecords = (page - 1) * pageSize;
        var pageItems = orderedCustomers
            .Skip(skippedRecords)
            .Take(pageSize)
            .ToArray();

        var result = new PagedCustomersResult
        {
            Items = pageItems,
            Page = page,
            PageSize = pageSize,
            TotalCount = orderedCustomers.Length
        };

        return Task.FromResult(result);
    }

    public Task<Customer?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        customers.TryGetValue(id, out var customer);
        return Task.FromResult(customer);
    }

    public Task<Customer> AddAsync(
        Customer customer,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        customers[customer.Id] = customer;
        return Task.FromResult(customer);
    }

    public Task<bool> UpdateAsync(
        Customer customer,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        if (!customers.ContainsKey(customer.Id))
        {
            return Task.FromResult(false);
        }

        customers[customer.Id] = customer;
        return Task.FromResult(true);
    }

    public Task<bool> DeleteAsync(
        Guid id,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        return Task.FromResult(customers.TryRemove(id, out _));
    }
}