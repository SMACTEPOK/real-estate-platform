import { useCallback, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from './AuthContext';
import {
  apiRequest,
  getToken,
  setToken,
  getStoredUser,
  setStoredUser,
  clearSession,
} from '@shared/api/client';

const initialState = {
  status: 'loading', // 'loading' | 'authenticated' | 'unauthenticated'
  user: null,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'auth/ready':
      return { status: 'authenticated', user: action.user, error: null };
    case 'auth/unauthorized':
      return { status: 'unauthenticated', user: null, error: null };
    case 'auth/login/start':
      return { ...state, error: null };
    case 'auth/login/success':
      return { status: 'authenticated', user: action.user, error: null };
    case 'auth/login/error':
      return { status: 'unauthenticated', user: null, error: action.error };
    case 'auth/logout':
      return { status: 'unauthenticated', user: null, error: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      dispatch({ type: 'auth/unauthorized' });
      return;
    }

    const cached = getStoredUser();
    if (cached) {
      dispatch({ type: 'auth/ready', user: cached });
    }

    let cancelled = false;
    apiRequest('/auth/me', { auth: true })
      .then((data) => {
        if (cancelled) return;
        setStoredUser(data.user);
        dispatch({ type: 'auth/ready', user: data.user });
      })
      .catch(() => {
        if (cancelled) return;
        clearSession();
        dispatch({ type: 'auth/unauthorized' });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    dispatch({ type: 'auth/login/start' });
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      setToken(data.token);
      setStoredUser(data.user);
      dispatch({ type: 'auth/login/success', user: data.user });
      return data.user;
    } catch (err) {
      dispatch({ type: 'auth/login/error', error: err.message });
      throw err;
    }
  }, []);

  const register = useCallback(async ({ email, password, displayName }) => {
    dispatch({ type: 'auth/login/start' });
    try {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: { email, password, displayName },
      });
      setToken(data.token);
      setStoredUser(data.user);
      dispatch({ type: 'auth/login/success', user: data.user });
      return data.user;
    } catch (err) {
      dispatch({ type: 'auth/login/error', error: err.message });
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    dispatch({ type: 'auth/logout' });
  }, []);

  const value = {
    status: state.status,
    user: state.user,
    error: state.error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
