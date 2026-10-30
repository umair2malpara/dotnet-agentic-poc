export interface ApiResponse<T> {
  readonly data: T;
}

export interface ApiProblemDetails {
  readonly title?: string;
  readonly detail?: string;
  readonly status?: number;
  readonly errors?: Readonly<Record<string, readonly string[]>>;
}
