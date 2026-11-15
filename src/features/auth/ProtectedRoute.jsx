import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import Spinner from '@shared/ui/Spinner/Spinner';
import { useAuth } from './AuthContext';

function ProtectedRoute({ children }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return <Spinner label="Перевірка сесії…" />;
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
