using DotnetAgenticPoc.Api.Models;

namespace DotnetAgenticPoc.Api.Services;

public interface ICustomerService
{
    Task<IReadOnlyCollection<Customer>> GetAllAsync(CancellationToken cancellationToken);

    Task<Customer?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<Customer> CreateAsync(Customer customer, CancellationToken cancellationToken);

    Task<bool> UpdateAsync(Customer customer, CancellationToken cancellationToken);

    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}