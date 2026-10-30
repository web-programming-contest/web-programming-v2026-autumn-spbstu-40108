import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {App} from './App.jsx';
import './styles.css';

const container = document.querySelector('[data-testid="app"]');

if (container === null) {
  throw new Error('Не найден корневой элемент приложения.');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
