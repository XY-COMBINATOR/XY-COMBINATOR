/**
 * Application Entry Point
 * Initializes React 18 Concurrent Root and mounts the XY Combinator application tree.
 */
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error('Target root element #root not found in document.');
}
