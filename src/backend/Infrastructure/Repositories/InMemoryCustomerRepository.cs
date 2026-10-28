using DotnetAgenticPoc.Application.Abstractions.Repositories;
using DotnetAgenticPoc.Domain.Models;

namespace DotnetAgenticPoc.Infrastructure.Repositories;

public sealed class InMemoryCustomerRepository : ICustomerRepository
{
    private readonly object syncRoot = new();
    private readonly Dictionary<Guid, Customer> customers = CreateSeedCustomers()
        .ToDictionary(customer => customer.Id);

    public Task<IReadOnlyCollection<Customer>> GetAllAsync(
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        lock (syncRoot)
        {
            IReadOnlyCollection<Customer> result = customers.Values.ToList();
            return Task.FromResult(result);
        }
    }

    public Task<Customer?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        lock (syncRoot)
        {
            customers.TryGetValue(id, out var customer);
            return Task.FromResult(customer);
        }
    }

    public Task<Customer> AddAsync(
        Customer customer,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        lock (syncRoot)
        {
            customers[customer.Id] = customer;
            return Task.FromResult(customer);
        }
    }

    public Task<bool> UpdateAsync(
        Customer customer,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        lock (syncRoot)
        {
            if (!customers.ContainsKey(customer.Id))
            {
                return Task.FromResult(false);
            }

            customers[customer.Id] = customer;
            return Task.FromResult(true);
        }
    }

    public Task<bool> DeleteAsync(
        Guid id,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        lock (syncRoot)
        {
            return Task.FromResult(customers.Remove(id));
        }
    }

    public Task<bool> DeleteManyAsync(
        IReadOnlyCollection<Guid> ids,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var uniqueIds = ids.Distinct().ToArray();
        if (uniqueIds.Length == 0)
        {
            return Task.FromResult(false);
        }

        lock (syncRoot)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (uniqueIds.Any(id => !customers.ContainsKey(id)))
            {
                return Task.FromResult(false);
            }

            foreach (var id in uniqueIds)
            {
                customers.Remove(id);
            }

            return Task.FromResult(true);
        }
    }

    private static IEnumerable<Customer> CreateSeedCustomers()
    {
        yield return new Customer
        {
            Id = Guid.Parse("11111111-1111-4111-8111-111111111111"),
            Name = "Alex Morgan",
            Email = "alex.morgan@example.test"
        };
        yield return new Customer
        {
            Id = Guid.Parse("22222222-2222-4222-8222-222222222222"),
            Name = "Jamie Lee",
            Email = "jamie.lee@example.test"
        };
        yield return new Customer
        {
            Id = Guid.Parse("33333333-3333-4333-8333-333333333333"),
            Name = "Taylor Rivera",
            Email = "taylor.rivera@example.test"
        };

        var additionalCustomers = new[]
        {
            ("Avery Chen", "avery.chen@example.test"),
            ("Jordan Patel", "jordan.patel@example.test"),
            ("Morgan Brooks", "morgan.brooks@example.test"),
            ("Riley Thompson", "riley.thompson@example.test"),
            ("Casey Nguyen", "casey.nguyen@example.test"),
            ("Quinn Foster", "quinn.foster@example.test"),
            ("Drew Bennett", "drew.bennett@example.test"),
            ("Cameron Diaz", "cameron.diaz@example.test"),
            ("Skyler James", "skyler.james@example.test"),
            ("Reese Wallace", "reese.wallace@example.test"),
            ("Parker Ellis", "parker.ellis@example.test"),
            ("Rowan Kim", "rowan.kim@example.test"),
            ("Finley Clark", "finley.clark@example.test"),
            ("Harper Singh", "harper.singh@example.test"),
            ("Emerson Reed", "emerson.reed@example.test"),
            ("Sage Turner", "sage.turner@example.test"),
            ("Blake Cooper", "blake.cooper@example.test")
        };

        for (var index = 0; index < additionalCustomers.Length; index++)
        {
            var (name, email) = additionalCustomers[index];
            var id = Guid.Parse($"44444444-4444-4444-8444-{index + 1:000000000000}");
            yield return new Customer { Id = id, Name = name, Email = email };
        }
    }
}
