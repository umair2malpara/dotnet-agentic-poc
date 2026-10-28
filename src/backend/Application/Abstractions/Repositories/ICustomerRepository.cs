using DotnetAgenticPoc.Domain.Models;

namespace DotnetAgenticPoc.Application.Abstractions.Repositories;

public interface ICustomerRepository
{
    Task<IReadOnlyCollection<Customer>> GetAllAsync(CancellationToken cancellationToken);

    Task<Customer?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<Customer> AddAsync(Customer customer, CancellationToken cancellationToken);

    Task<bool> UpdateAsync(Customer customer, CancellationToken cancellationToken);

    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);

    Task<bool> DeleteManyAsync(
        IReadOnlyCollection<Guid> ids,
        CancellationToken cancellationToken);
}