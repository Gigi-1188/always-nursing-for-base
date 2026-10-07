import {createRoot} from 'react-dom/client';
import {installTransport} from './api';
import App from './App';
import '../app/globals.css';
installTransport();
createRoot(document.getElementById('root')!).render(<App/>);
