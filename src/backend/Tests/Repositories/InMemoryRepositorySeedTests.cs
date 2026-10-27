using DotnetAgenticPoc.Infrastructure.Repositories;
using Xunit;

namespace DotnetAgenticPoc.Api.Tests.Repositories;

public sealed class InMemoryRepositorySeedTests
{
    [Fact]
    public async Task CustomerRepository_StartsWithThreeFictionalCustomers()
    {
        var repository = new InMemoryCustomerRepository();

        var customers = await repository.GetAllAsync(CancellationToken.None);

        Assert.Equal(3, customers.Count);
        Assert.All(customers, customer =>
        {
            Assert.False(string.IsNullOrWhiteSpace(customer.Name));
            Assert.EndsWith("@example.test", customer.Email);
        });
    }

    [Fact]
    public async Task ProductRepository_StartsWithThreeSampleProducts()
    {
        var repository = new InMemoryProductRepository();

        var products = await repository.GetAllAsync(CancellationToken.None);

        Assert.Equal(3, products.Count);
        Assert.All(products, product =>
        {
            Assert.False(string.IsNullOrWhiteSpace(product.Name));
            Assert.True(product.Price >= 0);
        });
    }
}
