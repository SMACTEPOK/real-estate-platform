import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FavoritesProvider } from '@app/providers/FavoritesProvider';
import CatalogPage from './CatalogPage';
import * as usePropertiesHook from '@entities/property/useProperties';

vi.mock('@entities/property/useProperties', () => ({
  useProperties: vi.fn(),
}));

describe('CatalogPage', () => {
  const mockItems = [
    { id: '1', title: 'Квартира Київ', type: 'apartment', deal: 'sale', price: 100, currency: 'USD', area: 50, rooms: 2, city: 'Київ', district: 'Центр', address: 'Хрещатик', image: 'img' },
    { id: '2', title: 'Будинок Львів', type: 'house', deal: 'rent', price: 200, currency: 'USD', area: 100, rooms: 4, city: 'Львів', district: 'Центр', address: 'Зелена', image: 'img' },
  ];

  const renderPage = () => render(
    <MemoryRouter>
      <FavoritesProvider>
        <CatalogPage />
      </FavoritesProvider>
    </MemoryRouter>
  );

  it('відображає список об\'єктів', () => {
    vi.mocked(usePropertiesHook.useProperties).mockReturnValue({ status: 'success', items: mockItems, error: null });
    renderPage();
    
    expect(screen.getByText('Квартира Київ')).toBeInTheDocument();
    expect(screen.getByText('Будинок Львів')).toBeInTheDocument();
  });

  it('фільтрує об\'єкти за пошуком', () => {
    vi.mocked(usePropertiesHook.useProperties).mockReturnValue({ status: 'success', items: mockItems, error: null });
    renderPage();
    
    const searchInput = screen.getByPlaceholderText(/Пошук/i);
    fireEvent.change(searchInput, { target: { value: 'Київ' } });
    
    expect(screen.getByText('Квартира Київ')).toBeInTheDocument();
    expect(screen.queryByText('Будинок Львів')).not.toBeInTheDocument();
  });
});
