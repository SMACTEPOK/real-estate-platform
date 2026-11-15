import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PropertyDetailPage from './PropertyDetailPage';
import * as usePropertyHook from '@entities/property/useProperty';

vi.mock('@entities/property/useProperty', () => ({ useProperty: vi.fn() }));

describe('PropertyDetailPage', () => {
  it('відображає деталі об\'єкта та кнопку туру', () => {
    vi.mocked(usePropertyHook.useProperty).mockReturnValue({ 
      status: 'success', 
      item: { id: 'p-001', title: 'Тестова Квартира', city: 'Київ', district: 'Центр', address: 'Хрещатик 1', price: 100, currency: 'USD', area: 50, rooms: 2, floor: 1, totalFloors: 5, description: 'Опис', features: [], panorama: 'url' } 
    });

    render(
      <MemoryRouter>
        <PropertyDetailPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Тестова Квартира')).toBeInTheDocument();
    // Шукаємо посилання за його роллю та доступним ім'ям (яке включає текст всередині)
    expect(screen.getByRole('link', { name: /Панорамний тур/i })).toBeInTheDocument();
  });
});
