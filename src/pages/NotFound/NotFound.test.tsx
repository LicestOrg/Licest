import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotFound from './NotFound';

describe('NotFound page', () => {
  test('should the title', async () => {
    render(<NotFound />);

    expect(await screen.findAllByText('404')).toBeDefined();
    expect(await screen.findAllByText('Not Found')).toBeDefined();
  });

  test('should render the button', async () => {
    render(<NotFound />);

    expect(await screen.findByText('Go to Home')).toBeDefined();
  });
});
