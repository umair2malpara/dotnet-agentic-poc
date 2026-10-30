namespace DotnetAgenticPoc.Api.Contracts;

public sealed record ApiResponse<T>(T? Data)
{
    public static ApiResponse<T> Success(T? data) => new(data);
}
