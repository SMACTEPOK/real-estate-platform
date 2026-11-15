import AppLayout from './AppLayout';
import AppProviders from './providers/AppProviders';
import AppRouter from './router';
import ErrorBoundary from './ErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <AppLayout>
          <AppRouter />
        </AppLayout>
      </AppProviders>
    </ErrorBoundary>
  );
}

export default App;
