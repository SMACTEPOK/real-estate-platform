import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProfilePage from './ProfilePage';
import * as AuthContext from '@features/auth/AuthContext';
import * as FavoritesContext from '@features/favorites/FavoritesContext';
import * as usePropertiesHook from '@entities/property/useProperties';

vi.mock('@features/auth/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('@features/favorites/FavoritesContext', () => ({ useFavorites: vi.fn() }));
vi.mock('@entities/property/useProperties', () => ({ useProperties: vi.fn() }));

describe('ProfilePage', () => {
  it('відображає дані користувача та порожнє обране', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({ user: { displayName: 'Test User', email: 'test@test.com', id: '1' }, logout: vi.fn() });
    vi.mocked(FavoritesContext.useFavorites).mockReturnValue({ favorites: [], clearFavorites: vi.fn() });
    vi.mocked(usePropertiesHook.useProperties).mockReturnValue({ status: 'success', items: [] });

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText(/Ви ще не додали жодного об'єкта в обране/i)).toBeInTheDocument();
  });
});
