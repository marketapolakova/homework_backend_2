export default class ErrorResponse {
  private status;
  private errors;
  constructor(status: string, errors: Array<NativeError | string>) {
    this.status = status;
    this.errors = errors;
  }
}
