import PropTypes from 'prop-types';
import { AuthProvider } from '@features/auth/AuthProvider';
import { FavoritesProvider } from './FavoritesProvider';

function AppProviders({ children }) {
  return (
    <AuthProvider>
      <FavoritesProvider>{children}</FavoritesProvider>
    </AuthProvider>
  );
}

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProviders;
