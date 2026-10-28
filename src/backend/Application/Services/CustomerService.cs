using DotnetAgenticPoc.Application.Abstractions.Repositories;
using DotnetAgenticPoc.Domain.Models;

namespace DotnetAgenticPoc.Application.Services;

public sealed class CustomerService(
    ICustomerRepository customerRepository) : ICustomerService
{
    public Task<IReadOnlyCollection<Customer>> GetAllAsync(
        CancellationToken cancellationToken) =>
        customerRepository.GetAllAsync(cancellationToken);

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

    public Task<bool> DeleteManyAsync(
        IReadOnlyCollection<Guid> ids,
        CancellationToken cancellationToken) =>
        customerRepository.DeleteManyAsync(ids, cancellationToken);
}