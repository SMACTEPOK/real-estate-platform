import { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { FavoritesContext } from '@features/favorites/FavoritesContext';

const STORAGE_KEY = 'estate.favorites';

function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function favoritesReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE':
      return state.includes(action.payload)
        ? state.filter((id) => id !== action.payload)
        : [...state, action.payload];
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, dispatch] = useReducer(favoritesReducer, null, loadFavorites);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      /* ignore */
    }
  }, [favorites]);

  const toggleFavorite = (id) => dispatch({ type: 'TOGGLE', payload: id });
  const clearFavorites = () => dispatch({ type: 'CLEAR' });

  const value = {
    favorites,
    toggleFavorite,
    clearFavorites,
    isFavorite: (id) => favorites.includes(id),
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

FavoritesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
