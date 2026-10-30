using DotnetAgenticPoc.Api.Contracts;
using DotnetAgenticPoc.Api.Contracts.Customers;
using DotnetAgenticPoc.Api.Controllers;
using DotnetAgenticPoc.Application.Services;
using DotnetAgenticPoc.Domain.Models;
using DotnetAgenticPoc.Infrastructure.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace DotnetAgenticPoc.Api.Tests.Controllers;

public sealed class CustomersControllerTests
{
    [Fact]
    public async Task Create_TrimsCustomerFieldsBeforeSaving()
    {
        var repository = new InMemoryCustomerRepository();
        var controller = new CustomersController(new CustomerService(repository));
        var customer = new Customer
        {
            Name = "  New Customer  ",
            Email = "  new.customer@example.test  "
        };

        var result = await controller.Create(customer, CancellationToken.None);
        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        var savedCustomer = Assert.IsType<ApiResponse<Customer>>(created.Value).Data!;

        Assert.Equal("New Customer", savedCustomer.Name);
        Assert.Equal("new.customer@example.test", savedCustomer.Email);
    }

    [Fact]
    public async Task GetAll_ReturnsCustomersInSuccessEnvelope()
    {
        var controller = new CustomersController(
            new CustomerService(new InMemoryCustomerRepository()));

        var result = await controller.GetAll(CancellationToken.None);
        var success = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<ApiResponse<IReadOnlyCollection<Customer>>>(success.Value);

        Assert.NotEmpty(response.Data!);
    }

    [Fact]
    public async Task Update_WhenCustomerExists_ReturnsNullDataSuccessEnvelope()
    {
        var repository = new InMemoryCustomerRepository();
        var existing = (await repository.GetAllAsync(CancellationToken.None)).First();
        var controller = new CustomersController(new CustomerService(repository));

        var result = await controller.Update(
            existing.Id,
            new Customer { Name = "Updated Customer", Email = "updated@example.test" },
            CancellationToken.None);
        var success = Assert.IsType<OkObjectResult>(result);

        Assert.Equal(new ApiResponse<object?>(null), success.Value);
    }

    [Fact]
    public async Task Delete_WhenCustomerExists_ReturnsNullDataSuccessEnvelope()
    {
        var repository = new InMemoryCustomerRepository();
        var existing = (await repository.GetAllAsync(CancellationToken.None)).First();
        var controller = new CustomersController(new CustomerService(repository));

        var result = await controller.Delete(existing.Id, CancellationToken.None);
        var success = Assert.IsType<OkObjectResult>(result);

        Assert.Equal(new ApiResponse<object?>(null), success.Value);
    }

    [Fact]
    public async Task GetById_WhenCustomerDoesNotExist_ReturnsProblemDetails()
    {
        var controller = new CustomersController(
            new CustomerService(new InMemoryCustomerRepository()));

        var result = await controller.GetById(Guid.NewGuid(), CancellationToken.None);
        var problem = Assert.IsType<ObjectResult>(result.Result);

        Assert.Equal(StatusCodes.Status404NotFound, problem.StatusCode);
        Assert.IsType<ProblemDetails>(problem.Value);
    }

    [Fact]
    public async Task Create_AllowsDuplicateEmailAddresses()
    {
        var repository = new InMemoryCustomerRepository();
        var controller = new CustomersController(new CustomerService(repository));
        var customer = new Customer
        {
            Name = "Another Customer",
            Email = "alex.morgan@example.test"
        };

        var result = await controller.Create(customer, CancellationToken.None);

        Assert.IsType<CreatedAtActionResult>(result.Result);
        Assert.Contains(
            await repository.GetAllAsync(CancellationToken.None),
            saved => saved.Name == "Another Customer" &&
                saved.Email == "alex.morgan@example.test");
    }

    [Theory]
    [InlineData("  ", "user@example.test")]
    [InlineData("Name", "not-an-email")]
    [InlineData("Name", "User <user@example.test>")]
    [InlineData("Name", "a..b@example.test")]
    [InlineData("Name", ".a@example.test")]
    [InlineData("Name", "a.@example.test")]
    [InlineData("Name", "a@localhost")]
    [InlineData("Name", "\"person\"@example.test")]
    [InlineData("Name", "person@example.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")]
    public async Task Create_WhenFieldsAreInvalid_ReturnsValidationProblem(
        string name,
        string email)
    {
        var controller = new CustomersController(
            new CustomerService(new InMemoryCustomerRepository()));

        var result = await controller.Create(
            new Customer { Name = name, Email = email },
            CancellationToken.None);

        var validationProblem = Assert.IsType<ObjectResult>(result.Result);
        Assert.Equal(StatusCodes.Status400BadRequest, validationProblem.StatusCode);
        Assert.IsType<ValidationProblemDetails>(validationProblem.Value);
    }

    [Theory]
    [InlineData("person@example.test")]
    [InlineData("person+tag@mail.example.test")]
    [InlineData("first.last@example.co")]
    public async Task Create_AcceptsEmailAddressesSupportedByCustomerForm(string email)
    {
        var controller = new CustomersController(
            new CustomerService(new InMemoryCustomerRepository()));

        var result = await controller.Create(
            new Customer { Name = "Valid Customer", Email = email },
            CancellationToken.None);

        Assert.IsType<CreatedAtActionResult>(result.Result);
    }

    [Fact]
    public async Task Update_WhenEmailIsInvalid_ReturnsValidationProblemWithoutUpdating()
    {
        var repository = new InMemoryCustomerRepository();
        var existing = (await repository.GetAllAsync(CancellationToken.None)).First();
        var controller = new CustomersController(new CustomerService(repository));

        var result = await controller.Update(
            existing.Id,
            new Customer { Name = "Changed", Email = "invalid" },
            CancellationToken.None);
        var validationProblem = Assert.IsType<ObjectResult>(result);

        Assert.Equal(StatusCodes.Status400BadRequest, validationProblem.StatusCode);
        Assert.Equal(
            "Alex Morgan",
            (await repository.GetByIdAsync(existing.Id, CancellationToken.None))?.Name);
    }

    [Fact]
    public async Task DeleteMany_WhenAllIdsExist_ReturnsSuccessEnvelope()
    {
        var repository = new InMemoryCustomerRepository();
        var ids = (await repository.GetAllAsync(CancellationToken.None))
            .Take(2)
            .Select(customer => customer.Id)
            .ToArray();
        var controller = new CustomersController(new CustomerService(repository));

        var result = await controller.DeleteMany(
            new BulkDeleteCustomersRequest { Ids = ids },
            CancellationToken.None);

        var success = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(StatusCodes.Status200OK, success.StatusCode);
        Assert.Equal(new ApiResponse<object?>(null), success.Value);
    }

    [Fact]
    public async Task DeleteMany_WhenAnyIdIsMissing_ReturnsNotFoundWithoutDeleting()
    {
        var repository = new InMemoryCustomerRepository();
        var existing = (await repository.GetAllAsync(CancellationToken.None)).First();
        var controller = new CustomersController(new CustomerService(repository));

        var result = await controller.DeleteMany(
            new BulkDeleteCustomersRequest
            {
                Ids = [existing.Id, Guid.NewGuid()]
            },
            CancellationToken.None);
        var problem = Assert.IsType<ObjectResult>(result);

        Assert.Equal(StatusCodes.Status404NotFound, problem.StatusCode);
        Assert.IsType<ProblemDetails>(problem.Value);
        Assert.NotNull(await repository.GetByIdAsync(existing.Id, CancellationToken.None));
    }

    [Fact]
    public async Task DeleteMany_WhenRequestIsEmpty_ReturnsValidationProblem()
    {
        var controller = new CustomersController(
            new CustomerService(new InMemoryCustomerRepository()));

        var result = await controller.DeleteMany(
            new BulkDeleteCustomersRequest { Ids = [] },
            CancellationToken.None);

        var problem = Assert.IsType<ObjectResult>(result);
        Assert.Equal(StatusCodes.Status400BadRequest, problem.StatusCode);
        Assert.IsType<ValidationProblemDetails>(problem.Value);
    }
}
