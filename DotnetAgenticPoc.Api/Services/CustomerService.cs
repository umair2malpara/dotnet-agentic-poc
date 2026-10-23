using DotnetAgenticPoc.Api.Contracts;
using DotnetAgenticPoc.Api.Models;
using DotnetAgenticPoc.Api.Repositories;

namespace DotnetAgenticPoc.Api.Services;

public sealed class CustomerService(
    ICustomerRepository customerRepository) : ICustomerService
{
    public Task<PagedCustomersResult> GetPagedAsync(
        int page,
        int pageSize,
        CancellationToken cancellationToken) =>
        customerRepository.GetPagedAsync(
            page,
            pageSize,
            cancellationToken);

    public Task<Customer?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken) =>
        customerRepository.GetByIdAsync(id, cancellationToken);

    public Task<Customer> CreateAsync(
        Customer customer,
        CancellationToken cancellationToken)
    {
        customer.Id = Guid.NewGuid();
        return customerRepository.AddAsync(customer, cancellationToken);
    }

    public Task<bool> UpdateAsync(
        Customer customer,
        CancellationToken cancellationToken) =>
        customerRepository.UpdateAsync(customer, cancellationToken);

    public Task<bool> DeleteAsync(
        Guid id,
        CancellationToken cancellationToken) =>
        customerRepository.DeleteAsync(id, cancellationToken);
}