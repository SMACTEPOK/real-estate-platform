import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test Error');
};

describe('ErrorBoundary', () => {
  it('відображає екран помилки при збої компонента', () => {
    // Вимикаємо console.error на час тесту, щоб не засмічувати вивід
    const originalError = console.error;
    console.error = () => {};
    
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Щось зламалося/i)).toBeInTheDocument();
    
    console.error = originalError;
  });
});
