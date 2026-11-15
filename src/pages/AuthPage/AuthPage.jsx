import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@features/auth/AuthContext';
import './AuthPage.css';

function AuthPage({ mode }) {
  const isLogin = mode === 'login';
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from || '/profile';

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Заповніть email і пароль');
      return;
    }
    if (!isLogin && !displayName.trim()) {
      setError('Вкажіть ім’я');
      return;
    }

    try {
      setSubmitting(true);
      if (isLogin) {
        await login(email.trim(), password);
      } else {
        await register({
          email: email.trim(),
          password,
          displayName: displayName.trim(),
        });
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Невідома помилка');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page__card">
        <p className="auth-page__tag">{isLogin ? 'ВХІД' : 'РЕЄСТРАЦІЯ'}</p>
        <h1 className="auth-page__title">{isLogin ? 'З поверненням' : 'Створити акаунт'}</h1>
        <p className="auth-page__hint">
          {isLogin
            ? 'Демо-акаунт: anna@estate.dev / craft2026'
            : 'Реєстрація створює нового користувача в mock API'}
        </p>

        <form className="auth-page__form" onSubmit={handleSubmit} noValidate>
          {!isLogin && (
            <label className="auth-page__field">
              <span>Ім’я</span>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoComplete="name"
                disabled={submitting}
              />
            </label>
          )}

          <label className="auth-page__field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={submitting}
            />
          </label>

          <label className="auth-page__field">
            <span>Пароль</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              disabled={submitting}
            />
          </label>

          {error && (
            <p className="auth-page__error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="auth-page__submit" disabled={submitting}>
            {submitting ? 'ХВИЛИНКУ…' : isLogin ? 'УВІЙТИ' : 'ЗАРЕЄСТРУВАТИСЯ'}
          </button>
        </form>

        <p className="auth-page__switch">
          {isLogin ? (
            <>
              Немає акаунта? <Link to="/register">Зареєструватися</Link>
            </>
          ) : (
            <>
              Уже є акаунт? <Link to="/login">Увійти</Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

AuthPage.propTypes = {
  mode: PropTypes.oneOf(['login', 'register']).isRequired,
};

export default AuthPage;
