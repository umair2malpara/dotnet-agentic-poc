using DotnetAgenticPoc.Api.Models;

namespace DotnetAgenticPoc.Api.Repositories;

public interface ICustomerRepository
{
    Task<IReadOnlyCollection<Customer>> GetAllAsync(CancellationToken cancellationToken);

    Task<Customer?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<Customer> AddAsync(Customer customer, CancellationToken cancellationToken);

    Task<bool> UpdateAsync(Customer customer, CancellationToken cancellationToken);

    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}