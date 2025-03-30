export default class ApiResponse<T> {
  statusCode: number;
  data?: T;
  message: string;

  constructor(statusCode: number, message: string, data?: T) {
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }

  static success<T>(data: T, message = "Success", statusCode = 200) {
    return new ApiResponse<T>(statusCode, message, data);
  }

  static error(message = "Something went wrong", statusCode = 500) {
    return new ApiResponse<null>(statusCode, message);
  }
}
