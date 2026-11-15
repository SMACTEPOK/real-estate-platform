import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FavoritesProvider } from '@app/providers/FavoritesProvider';
import PropertyCard from './PropertyCard';

const sample = {
  id: 'p-001',
  title: 'Тестова квартира',
  type: 'apartment',
  deal: 'sale',
  price: 100000,
  currency: 'USD',
  area: 60,
  rooms: 2,
  city: 'Київ',
  district: 'Печерський',
  address: 'вул. Хрещатик, 1',
  image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"/>',
};

const renderWithProviders = (ui) =>
  render(
    <MemoryRouter>
      <FavoritesProvider>{ui}</FavoritesProvider>
    </MemoryRouter>
  );

describe('PropertyCard', () => {
  it('рендерить назву, ціну та локацію', () => {
    const { getByText } = renderWithProviders(<PropertyCard property={sample} />);
    expect(getByText('Тестова квартира')).toBeInTheDocument();
    expect(getByText(/100000 USD/)).toBeInTheDocument();
    expect(getByText(/Київ, Печерський/)).toBeInTheDocument();
  });

  it('показує бейдж «Продаж» для deal=sale', () => {
    const { getByText } = renderWithProviders(<PropertyCard property={sample} />);
    expect(getByText('Продаж')).toBeInTheDocument();
  });

  it('показує бейдж «Оренда» і ціну за добу для deal=rent', () => {
    const rentProperty = { ...sample, deal: 'rent', price: 80 };
    const { getByText } = renderWithProviders(<PropertyCard property={rentProperty} />);
    expect(getByText('Оренда')).toBeInTheDocument();
    expect(getByText('/доба')).toBeInTheDocument();
  });

  it('показує бейдж «Новинка», якщо isNew=true', () => {
    const newProperty = { ...sample, isNew: true };
    const { getByText } = renderWithProviders(<PropertyCard property={newProperty} />);
    expect(getByText('Новинка')).toBeInTheDocument();
  });

  it('не показує бейдж «Новинка», якщо isNew не вказано', () => {
    const { queryByText } = renderWithProviders(<PropertyCard property={sample} />);
    expect(queryByText('Новинка')).toBeNull();
  });
});
