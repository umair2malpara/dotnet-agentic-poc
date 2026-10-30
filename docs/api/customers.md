# Customer API

The customer endpoints expose fictional, in-memory proof-of-concept data. The API is unauthenticated and is not intended for production exposure. Records, including changes made through the API, reset when the API restarts.

The frontend origin must be explicitly permitted by the API CORS configuration. In Development, the configured frontend origin is `http://localhost:4200`. CORS does not provide authentication or authorization.

All successful endpoints return the [shared API response contract](./responses.md). The resource representation below is nested under the envelope's `data` property.

## Customer representation

```json
{
  "id": "11111111-1111-4111-8111-111111111111",
  "name": "Alex Morgan",
  "email": "alex.morgan@example.test"
}
```

Names and emails are trimmed before create/update. A name must contain a non-whitespace character. Email must match the API's email syntax validation. Duplicate email addresses are allowed.

## Endpoints

| Method | Path | Success | Failure |
|---|---|---|---|
| `GET` | `/api/customers` | `200 OK`, wrapped customer collection | Problem Details |
| `GET` | `/api/customers/{id}` | `200 OK`, wrapped customer | `404 Not Found`, Problem Details |
| `POST` | `/api/customers` | `201 Created`, wrapped customer | `400 Bad Request`, Validation Problem Details |
| `PUT` | `/api/customers/{id}` | `200 OK`, `{ "data": null }` | `400 Bad Request`, Validation Problem Details; `404 Not Found`, Problem Details |
| `DELETE` | `/api/customers/{id}` | `200 OK`, `{ "data": null }` | `404 Not Found`, Problem Details |
| `POST` | `/api/customers/bulk-delete` | `200 OK`, `{ "data": null }` | `400 Bad Request` for an empty/invalid request; `404 Not Found` if any ID does not exist |

### Atomic bulk deletion

`POST /api/customers/bulk-delete` accepts one or more customer IDs:

```json
{
  "ids": [
    "11111111-1111-4111-8111-111111111111",
    "22222222-2222-4222-8222-222222222222"
  ]
}
```

IDs are deduplicated. If every distinct ID exists, all requested customers are removed and the API returns `200 OK` with `{ "data": null }`. If any ID is missing, none are removed and the API returns `404 Not Found` with a Problem Details response. Empty ID collections and malformed requests are rejected without mutation.

The in-memory repository synchronizes bulk deletion with other customer reads and mutations so a batch is not partially applied by concurrent API calls.
