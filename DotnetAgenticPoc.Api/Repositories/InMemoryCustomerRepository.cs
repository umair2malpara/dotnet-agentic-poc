using System.Collections.Concurrent;
using DotnetAgenticPoc.Api.Models;

namespace DotnetAgenticPoc.Api.Repositories;

public sealed class InMemoryCustomerRepository : ICustomerRepository
{
    private readonly ConcurrentDictionary<Guid, Customer> customers = new(
        new Dictionary<Guid, Customer>
        {
            [Guid.Parse("11111111-1111-4111-8111-111111111111")] = new()
            {
                Id = Guid.Parse("11111111-1111-4111-8111-111111111111"),
                Name = "Alex Morgan",
                Email = "alex.morgan@example.test"
            },
            [Guid.Parse("22222222-2222-4222-8222-222222222222")] = new()
            {
                Id = Guid.Parse("22222222-2222-4222-8222-222222222222"),
                Name = "Jamie Lee",
                Email = "jamie.lee@example.test"
            },
            [Guid.Parse("33333333-3333-4333-8333-333333333333")] = new()
            {
                Id = Guid.Parse("33333333-3333-4333-8333-333333333333"),
                Name = "Taylor Rivera",
                Email = "taylor.rivera@example.test"
            }
        });

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