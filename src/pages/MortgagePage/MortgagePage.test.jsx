import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MortgagePage from './MortgagePage';

describe('MortgagePage', () => {
  it('відображає початкові розрахунки', () => {
    render(<MortgagePage />);
    
    expect(screen.getByText(/ІПОТЕКА/i)).toBeInTheDocument();
    expect(screen.getByText(/Щомісячний платіж/i)).toBeInTheDocument();
  });
});
