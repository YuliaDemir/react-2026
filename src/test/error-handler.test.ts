// error-handler.test.ts
import { describe, expect, it } from 'vitest';

import { ErrorHandler } from '../utils/error-handler';

describe('ErrorHandler', () => {
  it('creates instance of ErrorHandler', () => {
    const error = new ErrorHandler('Test error', 404);

    expect(error).toBeInstanceOf(ErrorHandler);
  });

  it('creates instance of Error', () => {
    const error = new ErrorHandler('Test error', 404);

    expect(error).toBeInstanceOf(Error);
  });

  it('stores original error message', () => {
    const error = new ErrorHandler('API call failed', 500);

    expect(error.message).toBe('API call failed');
  });

  it('stores status', () => {
    const error = new ErrorHandler('Not found', 404);

    expect(error.status).toBe(404);
  });

  it('returns message for status less than 400', () => {
    const error = new ErrorHandler('Redirect', 302);

    expect(error.getErrorMessageByStatus()).toBe(
      'Unexpected response status',
    );
  });

  it.each([
    [400, 'Invalid request. Please check the data and try again.'],
    [401, 'You need to sign in to continue.'],
    [403, 'You do not have permission to perform this action.'],
    [404, 'The requested product was not found.'],
    [408, 'The request took too long. Please try again.'],
    [409, 'There is a conflict with the current data.'],
    [422, 'Some fields contain invalid data.'],
    [429, 'Too many requests. Please try again later.'],
    [500, 'Something went wrong on the server. Please try again later.'],
    [502, 'The server received an invalid response. Please try again later.'],
    [503, 'The service is temporarily unavailable. Please try again later.'],
    [504, 'The server took too long to respond. Please try again later.'],
  ])('returns correct message for status %s', (status, expectedMessage) => {
    const error = new ErrorHandler('API error', status);

    expect(error.getErrorMessageByStatus()).toBe(expectedMessage);
  });

  it('returns default client error message for unknown 4xx status', () => {
    const error = new ErrorHandler('Client error', 418);

    expect(error.getErrorMessageByStatus()).toBe(
      'Something went wrong with the request.',
    );
  });

  it('returns default server error message for unknown 5xx status', () => {
    const error = new ErrorHandler('Server error', 599);

    expect(error.getErrorMessageByStatus()).toBe(
      'Something went wrong on our side. Please try again later.',
    );
  });
});