using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace DotnetAgenticPoc.Api.Contracts;

public static class ApiProblemDetailsFactory
{
    public static ObjectResult CreateValidationProblem(ModelStateDictionary modelState)
    {
        var problem = new ValidationProblemDetails(modelState)
        {
            Status = StatusCodes.Status400BadRequest
        };

        return new ObjectResult(problem)
        {
            StatusCode = StatusCodes.Status400BadRequest
        };
    }
}
