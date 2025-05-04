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


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // Wraps all children with Navbar
    errorElement: <NotFoundPage />,
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
        path: 'inventory/item-list/add',
        element: <InventoryAddMedicine />,
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
  {
    path: '/login',
    element: <LoginPage />,
  },
]);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);



