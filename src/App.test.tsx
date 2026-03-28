import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('shows the landing invitation', () => {
    render(<App />);
    expect(screen.getByText(/Tu as un message/i)).toBeInTheDocument();
  });
});
