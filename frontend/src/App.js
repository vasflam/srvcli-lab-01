import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  Outlet,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import { useAuth, AuthProvider } from './hooks';
import {
  PublicLayout,
  PrivateLayout,
  LoginPage,
  SignUpPage,
  LogoutPage,
  HomePage,
  GamePage,
} from './pages';


/**
 * Application
 */
function App() {
  return (
    <AuthProvider>
      <CssVarsProvider>
        <main>
          <BrowserRouter>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
              </Route>
              <Route path="/" element={<PrivateLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/game" element={<GamePage />} />
                <Route path="/game/:id" element={<LogoutPage />} />
                <Route path="/logout" element={<LogoutPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </main>
      </CssVarsProvider>
    </AuthProvider>
  );
}

export default App;
