using DotnetAgenticPoc.Api.Contracts;
using DotnetAgenticPoc.Application.Services;
using DotnetAgenticPoc.Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace DotnetAgenticPoc.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ProductsController(
    IProductService productService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IReadOnlyCollection<Product>>>> GetAll(
        CancellationToken cancellationToken)
    {
        var products = await productService.GetAllAsync(cancellationToken);
        return Ok(ApiResponse<IReadOnlyCollection<Product>>.Success(products));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<Product>>> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var product = await productService.GetByIdAsync(id, cancellationToken);

        return product is null
            ? Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Product not found",
                detail: "The requested product was not found.")
            : Ok(ApiResponse<Product>.Success(product));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<Product>>> Create(
        Product product,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(product.Name))
        {
            ModelState.AddModelError(
                nameof(product.Name),
                "Product name is required.");
        }
        if (product.Price < 0)
        {
            ModelState.AddModelError(
                nameof(product.Price),
                "Product price must be non-negative.");
        }
        if (!ModelState.IsValid)
        {
            return ApiProblemDetailsFactory.CreateValidationProblem(ModelState);
        }

        var createdProduct =
            await productService.CreateAsync(product, cancellationToken);

        return CreatedAtAction(
            nameof(GetById),
            new { id = createdProduct.Id },
            ApiResponse<Product>.Success(createdProduct));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        Product product,
        CancellationToken cancellationToken)
    {
        product.Id = id;

        var updated = await productService.UpdateAsync(
            product,
            cancellationToken);

        return updated
            ? Ok(ApiResponse<object?>.Success(null))
            : Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Product not found",
                detail: "The requested product was not found.");
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(
        Guid id,
        CancellationToken cancellationToken)
    {
        var deleted = await productService.DeleteAsync(
            id,
            cancellationToken);

        return deleted
            ? Ok(ApiResponse<object?>.Success(null))
            : Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Product not found",
                detail: "The requested product was not found.");
    }
}