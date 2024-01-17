import * as http2 from 'http2';

class BadRequestError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = http2.constants.HTTP_STATUS_BAD_REQUEST;
  }
}

export default BadRequestError;
