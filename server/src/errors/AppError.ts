export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }

  static notFound(resource: string, id: string): AppError {
    return new AppError(404, `${resource} with id "${id}" was not found`);
  }

  static badRequest(message: string): AppError {
    return new AppError(400, message);
  }
}
