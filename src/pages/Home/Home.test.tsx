import { describe, expect, test, beforeAll, afterEach, afterAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import Home from './Home';

const server = setupServer(
  http.get('/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
    ]);
  })
);

describe('Home page', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test('should the title', async () => {
    render(<Home />);
    expect(await screen.findByText('Users')).toBeDefined();
  });

  test('should render the users', async () => {
    render(<Home />);
    expect(await screen.findByText('John Doe')).toBeDefined();
    expect(await screen.findByText('Jane Doe')).toBeDefined();
  });
});
