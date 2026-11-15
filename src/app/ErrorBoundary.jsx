import { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // TODO (ітерація 9): відправка у Sentry / консоль-логер
    console.error('[ErrorBoundary]', error, info?.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: '48px 24px',
          background: 'var(--color-background)',
          color: 'var(--color-text)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <div style={{ maxWidth: 520, textAlign: 'center' }}>
          <h1
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 32,
              margin: '0 0 16px',
              color: 'var(--color-white)',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
            }}
          >
            Щось зламалося
          </h1>
          <p style={{ margin: '0 0 24px', lineHeight: 1.7 }}>
            Сталася непередбачувана помилка. Спробуйте перезавантажити сторінку.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            style={{
              fontFamily: 'inherit',
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-ink)',
              background: 'var(--color-white)',
              border: '3px solid var(--color-white)',
              padding: '12px 20px',
              boxShadow: '5px 5px 0 var(--color-shadow)',
              cursor: 'pointer',
            }}
          >
            Повернутися
          </button>
        </div>
      </div>
    );
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
