import PropTypes from 'prop-types';
import { NavLink, Link } from 'react-router-dom';
import { PUBLIC_NAV } from '@shared/config/navigation';
import { useAuth } from '@features/auth/AuthContext';

function AppLayout({ children }) {
  const { status, user, logout } = useAuth();
  const isAuthenticated = status === 'authenticated';

  return (
    <div className="app">
      <header className="app__header">
        <Link to="/" className="app__brand">
          <span className="app__brand-mark">▣</span>
          ESTATE
          <span className="app__brand-tag">UA</span>
        </Link>

        <nav className="app__nav" aria-label="Головна навігація">
          {PUBLIC_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                'app__nav-link' + (isActive ? ' app__nav-link--active' : '')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="app__auth">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="app__btn app__btn--ghost">
                {user?.displayName ?? 'Профіль'}
              </Link>
              <button type="button" className="app__btn" onClick={logout}>
                Вийти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="app__btn app__btn--ghost">
                Увійти
              </Link>
              <Link to="/register" className="app__btn">
                Реєстрація
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="app__main">{children}</main>

      <footer className="app__footer">
        <span>© 2026 ESTATE</span>
      </footer>
    </div>
  );
}

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
