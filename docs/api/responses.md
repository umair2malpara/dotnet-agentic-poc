# API Response Contract

All API endpoints use one success envelope and standard Problem Details for failures. The response format is a compatibility change for clients that previously consumed unwrapped resource bodies.

## Successful responses

Successful responses contain the endpoint payload in `data`:

```json
{
  "data": [
    {
      "id": "11111111-1111-4111-8111-111111111111",
      "name": "Alex Morgan",
      "email": "alex.morgan@example.test"
    }
  ]
}
```

Resources keep their existing fields. `201 Created` responses continue to include the created resource and its `Location` header.

Operations that previously returned `204 No Content` now return `200 OK` with an explicit null `data` value:

```json
{
  "data": null
}
```

This includes successful customer and product update/delete operations and customer bulk deletion.

## Error responses

Errors use `application/problem+json` and RFC Problem Details. For example:

```json
{
  "type": "about:blank",
  "title": "Customer not found",
  "status": 404,
  "detail": "The requested customer was not found."
}
```

Validation errors use `ValidationProblemDetails` with an `errors` object keyed by field. Controllers use the shared API validation-problem factory so validation responses remain consistent. Unexpected exceptions return a generic `500 Internal Server Error` problem response; implementation details and stack traces are logged server-side and are not returned to clients. The `X-Correlation-Id` response header can be supplied when reporting an error.

## Angular usage

The shared Angular HTTP interceptor unwraps a valid success response so resource API services continue to expose their typed resource data. It preserves HTTP failures and their structured Problem Details for feature-level handling. API requests can opt into a success message or suppress the global failure toast when the feature presents the failure inline. Success notifications are for user-triggered changes or explicit refreshes; automatic reads remain silent.
