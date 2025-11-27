import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AppRoutes from '@/routes/AppRoutes';
import { Toaster } from '@/components/ui/toaster';

function App() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <AppRoutes />
                <Toaster />
            </BrowserRouter>
        </HelmetProvider>
    );
}

export default App;
