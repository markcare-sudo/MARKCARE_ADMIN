import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './context/AuthContext';
import { RolesProvider } from './context/RolesContext';
import { ModulesProvider } from './context/ModulesContext';
import { UsersProvider } from './context/UsersContext';
import App from './App.jsx'
import './index.css'
import "react-quill/dist/quill.snow.css";
import "./styles/global.css";
import { BrandProvider } from './context/BrandContext';
import { ProductProvider } from './context/ProductContext';
import { CategoryProvider } from './context/CategoryContext';
import { ServiceProvider } from './context/ServiceContext';
import { OrderProvider } from './context/OrderContext';
import { GlobalProvider } from './context/GlobalContext';
import { BookingProvider } from './context/BookingContext';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          {/* 1. Global Config/Structures first */}

          <GlobalProvider>
            <ModulesProvider>
              {/* 2. Identity and Access next */}
              <RolesProvider>
                <UsersProvider>
                  <BrandProvider>
                    <CategoryProvider>
                      <ProductProvider>
                        <ServiceProvider>
                          <OrderProvider>
                            <BookingProvider>
                              <App />
                            </BookingProvider>
                          </OrderProvider>
                        </ServiceProvider>
                      </ProductProvider>
                    </CategoryProvider>
                  </BrandProvider>
                </UsersProvider>
              </RolesProvider>
            </ModulesProvider>
          </GlobalProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
)
