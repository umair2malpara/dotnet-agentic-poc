using DotnetAgenticPoc.Api.Contracts;
using DotnetAgenticPoc.Api.Controllers;
using DotnetAgenticPoc.Application.Services;
using DotnetAgenticPoc.Domain.Models;
using DotnetAgenticPoc.Infrastructure.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace DotnetAgenticPoc.Api.Tests.Controllers;

public sealed class ProductsControllerTests
{
    [Fact]
    public async Task GetAll_ReturnsProductsInSuccessEnvelope()
    {
        var controller = new ProductsController(
            new ProductService(new InMemoryProductRepository()));

        var result = await controller.GetAll(CancellationToken.None);
        var success = Assert.IsType<OkObjectResult>(result.Result);

        Assert.IsType<ApiResponse<IReadOnlyCollection<Product>>>(success.Value);
    }

    [Fact]
    public async Task GetById_WhenProductDoesNotExist_ReturnsProblemDetails()
    {
        var controller = new ProductsController(
            new ProductService(new InMemoryProductRepository()));

        var result = await controller.GetById(Guid.NewGuid(), CancellationToken.None);
        var problem = Assert.IsType<ObjectResult>(result.Result);

        Assert.Equal(StatusCodes.Status404NotFound, problem.StatusCode);
        Assert.IsType<ProblemDetails>(problem.Value);
    }

    [Fact]
    public async Task Create_WhenProductIsValid_ReturnsCreatedSuccessEnvelope()
    {
        var controller = new ProductsController(
            new ProductService(new InMemoryProductRepository()));

        var result = await controller.Create(
            new Product { Name = "New Product", Price = 12.50m },
            CancellationToken.None);
        var created = Assert.IsType<CreatedAtActionResult>(result.Result);

        Assert.IsType<ApiResponse<Product>>(created.Value);
        Assert.Equal(StatusCodes.Status201Created, created.StatusCode);
    }

    [Fact]
    public async Task Create_WhenProductIsInvalid_ReturnsValidationProblemDetails()
    {
        var controller = new ProductsController(
            new ProductService(new InMemoryProductRepository()));

        var result = await controller.Create(
            new Product { Name = "", Price = -1 },
            CancellationToken.None);
        var problem = Assert.IsType<ObjectResult>(result.Result);

        Assert.Equal(StatusCodes.Status400BadRequest, problem.StatusCode);
        Assert.IsType<ValidationProblemDetails>(problem.Value);
    }

    [Fact]
    public async Task Update_WhenProductExists_ReturnsNullDataSuccessEnvelope()
    {
        var repository = new InMemoryProductRepository();
        var existing = (await repository.GetAllAsync(CancellationToken.None)).First();
        var controller = new ProductsController(new ProductService(repository));

        var result = await controller.Update(
            existing.Id,
            new Product { Name = "Updated product", Price = 10 },
            CancellationToken.None);
        var success = Assert.IsType<OkObjectResult>(result);

        Assert.Equal(new ApiResponse<object?>(null), success.Value);
    }

    [Fact]
    public async Task Delete_WhenProductExists_ReturnsNullDataSuccessEnvelope()
    {
        var repository = new InMemoryProductRepository();
        var existing = (await repository.GetAllAsync(CancellationToken.None)).First();
        var controller = new ProductsController(new ProductService(repository));

        var result = await controller.Delete(existing.Id, CancellationToken.None);
        var success = Assert.IsType<OkObjectResult>(result);

        Assert.Equal(new ApiResponse<object?>(null), success.Value);
    }
}
