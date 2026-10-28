using System.Text.RegularExpressions;
using DotnetAgenticPoc.Api.Contracts.Customers;
using DotnetAgenticPoc.Application.Services;
using DotnetAgenticPoc.Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace DotnetAgenticPoc.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class CustomersController(
    ICustomerService customerService) : ControllerBase
{
    private static readonly Regex EmailRegex = new(
        @"^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$",
        RegexOptions.CultureInvariant);

    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<Customer>>> GetAll(
        CancellationToken cancellationToken)
    {
        var customers = await customerService.GetAllAsync(cancellationToken);
        return Ok(customers);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Customer>> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var customer = await customerService.GetByIdAsync(id, cancellationToken);

        return customer is null
            ? NotFound()
            : Ok(customer);
    }

    [HttpPost]
    public async Task<ActionResult<Customer>> Create(
        Customer customer,
        CancellationToken cancellationToken)
    {
        if (!TryNormalizeCustomer(customer, out var validationError))
        {
            ModelState.AddModelError(validationError.Key, validationError.Value);
            return CreateValidationProblem();
        }

        var createdCustomer =
            await customerService.CreateAsync(customer, cancellationToken);

        return CreatedAtAction(
            nameof(GetById),
            new { id = createdCustomer.Id },
            createdCustomer);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        Customer customer,
        CancellationToken cancellationToken)
    {
        if (!TryNormalizeCustomer(customer, out var validationError))
        {
            ModelState.AddModelError(validationError.Key, validationError.Value);
            return CreateValidationProblem();
        }

        customer.Id = id;

        var updated = await customerService.UpdateAsync(
            customer,
            cancellationToken);

        return updated ? NoContent() : NotFound();
    }

    [HttpPost("bulk-delete")]
    public async Task<IActionResult> DeleteMany(
        BulkDeleteCustomersRequest request,
        CancellationToken cancellationToken)
    {
        if (request.Ids is null || request.Ids.Count == 0)
        {
            ModelState.AddModelError(
                nameof(request.Ids),
                "At least one customer ID is required.");
            return CreateValidationProblem();
        }

        var deleted = await customerService.DeleteManyAsync(
            request.Ids,
            cancellationToken);

        return deleted
            ? NoContent()
            : Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Customer not found",
                detail: "No customers were deleted because one or more requested IDs do not exist.");
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(
        Guid id,
        CancellationToken cancellationToken)
    {
        var deleted = await customerService.DeleteAsync(
            id,
            cancellationToken);

        return deleted ? NoContent() : NotFound();
    }

    private static bool TryNormalizeCustomer(
        Customer customer,
        out KeyValuePair<string, string> validationError)
    {
        customer.Name = customer.Name?.Trim() ?? string.Empty;
        customer.Email = customer.Email?.Trim() ?? string.Empty;

        if (customer.Name.Length == 0)
        {
            validationError = new(
                nameof(customer.Name),
                "Name is required.");
            return false;
        }

        if (customer.Email.Length == 0 || !EmailRegex.IsMatch(customer.Email))
        {
            validationError = new(
                nameof(customer.Email),
                "A valid email address is required.");
            return false;
        }

        validationError = default;
        return true;
    }

    private ObjectResult CreateValidationProblem()
    {
        var problem = new ValidationProblemDetails(ModelState)
        {
            Status = StatusCodes.Status400BadRequest
        };
        return new ObjectResult(problem)
        {
            StatusCode = StatusCodes.Status400BadRequest
        };
    }
}