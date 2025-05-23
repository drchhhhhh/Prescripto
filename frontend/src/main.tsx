import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import LoginPage from './pages/Login.tsx';
import Dashboard from './pages/Dashboard.tsx';
import StockStatus from './pages/Inventory/StockStatus.tsx';
import InventoryPage from './pages/Inventory/Inventory.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import InventoryItems from './pages/Inventory/InventoryItems.tsx';
import InventoryAddMedicine from './pages/Inventory/InventoryAddMedicine.tsx';
import TransactionForm from './pages/Transaction/TransactionLog.tsx';
import TransactionHistory from './pages/Transaction/TransactionHistory.tsx';
import InventoryGroups from './pages/Inventory/InventoryGroups.tsx';

import { AuthProvider } from './contexts/AuthContext.tsx'
import InvItemDetails from './components/Inventory/InvItemDetails.tsx';
import ProtectedRoute from './utils/ProtectedRoute.tsx';
import InventoryEditMedicine from './components/Inventory/InventoryEditMedicine.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <Layout />, // Layout now only wraps protected routes
            children: [
              {
                index: true,
                element: <div>HOME</div>,
              },
              {
                path: 'dashboard',
                element: <Dashboard />,
              },
              {
                path: 'inventory/stockstatus',
                element: <StockStatus />,
              },
              {
                path: 'inventory',
                element: <InventoryPage />,
              },
              {
                path: 'inventory/item-list',
                element: <InventoryItems />,
              },
              {
                path: 'inventory/item-list/item/:medicineId',
                element: <InvItemDetails />,
              },
              {
                path: 'inventory/item-list/add',
                element: <InventoryAddMedicine />,
              },
              {
                path: 'inventory/item-list/edit/:medicineId',
                element: <InventoryEditMedicine />,
              },
              {
                path: 'inventory/groups',
                element: <InventoryGroups />,
              },
              {
                path: 'transaction/log',
                element: <TransactionForm />,
              },
              {
                path: 'transaction/history',
                element: <TransactionHistory />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
