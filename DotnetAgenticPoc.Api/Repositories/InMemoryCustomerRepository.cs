using System.Collections.Concurrent;
using DotnetAgenticPoc.Api.Models;

namespace DotnetAgenticPoc.Api.Repositories;

public sealed class InMemoryCustomerRepository : ICustomerRepository
{
    private readonly ConcurrentDictionary<Guid, Customer> customers = new();

    public Task<IReadOnlyCollection<Customer>> GetAllAsync(
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        IReadOnlyCollection<Customer> result = customers.Values.ToList();
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