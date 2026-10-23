using DotnetAgenticPoc.Api.Contracts;
using DotnetAgenticPoc.Api.Models;
using DotnetAgenticPoc.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace DotnetAgenticPoc.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class CustomersController(
    ICustomerService customerService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedCustomersResult>> GetAll(
        [FromQuery] CustomersPageQuery query,
        CancellationToken cancellationToken)
    {
        if (query.Page <= 0)
        {
            return BadRequest("Page must be greater than 0.");
        }

        if (query.PageSize <= 0 || query.PageSize > 100)
        {
            return BadRequest("PageSize must be between 1 and 100.");
        }

        var customers = await customerService.GetPagedAsync(
            query.Page,
            query.PageSize,
            cancellationToken);

        var isOutOfRange = customers.TotalCount == 0
            ? query.Page > 1
            : (query.Page - 1) * query.PageSize >= customers.TotalCount;

        if (isOutOfRange)
        {
            return BadRequest(
                "Requested page is out of range. Please provide a valid page number.");
        }

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
        if (string.IsNullOrWhiteSpace(customer.Name) ||
            string.IsNullOrWhiteSpace(customer.Email))
        {
            return BadRequest("Name and email are required.");
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
        customer.Id = id;

        var updated = await customerService.UpdateAsync(
            customer,
            cancellationToken);

        return updated ? NoContent() : NotFound();
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
}