import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders app', () => {
  render(<App />);
  const element = screen.getByText(/Healthcare Plan Finder/i);
  expect(element).toBeInTheDocument();
});
