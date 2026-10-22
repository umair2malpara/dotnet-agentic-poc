using DotnetAgenticPoc.Api.Models;

namespace DotnetAgenticPoc.Api.Services;

public interface IProductService
{
    Task<IReadOnlyCollection<Product>> GetAllAsync(CancellationToken cancellationToken);

    Task<Product?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<Product> CreateAsync(Product product, CancellationToken cancellationToken);

    Task<bool> UpdateAsync(Product product, CancellationToken cancellationToken);

    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}