import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import LoginPage from './pages/Login.tsx'
import InventoryPage from './pages/Inventory/Inventory.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'
import InventoryItems from './pages/Inventory/InventoryItems.tsx'
import InventoryAddMedicine from './pages/Inventory/InventoryAddMedicine.tsx'
import TransactionForm from './pages/Transaction/TransactionLog.tsx'
import TransactionHistory from './pages/Transaction/TransactionHistory.tsx'
import InventoryGroups from './pages/Inventory/InventoryGroups.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <div>HOME</div>,
    errorElement: <NotFoundPage />
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/inventory',
    element: <InventoryPage />,
  },
  {
    path: '/inventory/item-list',
    element: <InventoryItems />,
  },
  {
    path: '/inventory/item-list/add',
    element: <InventoryAddMedicine />,
  },
  {
    path: '/inventory/item-groups',
    element: <InventoryGroups />,
  },
  {
    path: '/transaction/log',
    element: <TransactionForm />,
  },
  {
    path: '/transaction/history',
    element: <TransactionHistory />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
