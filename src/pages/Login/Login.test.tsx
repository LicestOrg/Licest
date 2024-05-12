import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import Login from './Login';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Login page', () => {
  test('should the title', async () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    expect(await screen.findAllByText('Login')).toBeDefined();
  });

  test('should render the form', async () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    expect(await screen.findByText('Email Address *')).toBeDefined();
    expect(await screen.findByText('Password *')).toBeDefined();
  });

  test('should login', async () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    const email = screen.getByText('Email Address').nextElementSibling as HTMLInputElement;
    const password = screen.getByText('Password').nextElementSibling as HTMLInputElement;
    const allLogins = screen.getAllByText('Login');
    const submit = allLogins[allLogins.length - 1] as HTMLButtonElement;

    email.value = 'example@example.com';
    password.value = 'password';

    submit.click();
  });
});
