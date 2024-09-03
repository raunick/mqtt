import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Erro404 from './pages/Erro404';
import Dashboard from './pages/DashboardPage.tsx';
import Sensors from './pages/SensorsPage.tsx';
import Adminstrator from './pages/AdminstratorPage.tsx';
import Simulator3dPage from './pages/Simulator3dPage.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Erro404 />,
    children:[
      {
        path: "/Dashboard",
        element: <Dashboard />
      },
      {
        path: "/Sensors",
        element: <Sensors />
      },
      {
        path: "/Adminstrator",
        element: <Adminstrator />
      },
      {
        path: "/3d",
        element: <Simulator3dPage />
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
