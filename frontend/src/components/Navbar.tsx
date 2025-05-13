"use client"

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../assets/logo.svg';
import {
  ChevronDown,
  ChevronUp,
  LogOut,
  Layout,
  Package,
  BarChart2,
} from 'lucide-react';
import { endpoints } from '../config/config';

interface User {
  username: string;
  role: string;
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await fetch(endpoints.me, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        })

        if (!response.ok){
          throw new Error("Failed to fetch user data.");
        }

        const data: User = await response.json();
        setUserData(data);
      } catch (error) {
        console.error(error)
      }
    }
    
    getUserData();
  }, [token])

  // Check if current path is in inventory or transaction routes
  useEffect(() => {
    if (currentPath.includes('/inventory')) {
      setIsInventoryOpen(true);
    }
    if (currentPath.includes('/transaction')) {
      setIsTransactionOpen(true);
    }
  }, [currentPath]);

  // Function to check if a path is active
  const isActive = (path: string) => {
    return currentPath === path;
  };

  // Function to check if a path is in active group
  const isInActiveGroup = (basePath: string) => {
    return currentPath.includes(basePath);
  };

  // Handle dropdown toggle with exclusive behavior
  const handleDropdownToggle = (dropdown: string) => {
    if (dropdown === 'inventory') {
      setIsInventoryOpen(prev => !prev);
      setIsTransactionOpen(false);
    } else if (dropdown === 'transaction') {
      setIsTransactionOpen(prev => !prev);
      setIsInventoryOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(endpoints.logout, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
      
      if(!response.ok) {
        throw new Error("Error logging out user");
      }

      localStorage.removeItem("token")
      localStorage.removeItem("userID")
      navigate("/login")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm font-poppins z-50">
      {/* Logo */}
      <header className="p-4 flex items-center border-b border-gray-100">
        <img src={Logo} alt="Prescripto Logo" className="h-8 w-auto"/>
        <span className="ml-2 text-xl font-semibold text-primaryGreen">Prescripto</span>
      </header>

      {/* Profile Section */}
      <section className="p-4 flex items-center justify-between border-b border-gray-100 relative">
        <figure className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-primaryGreen">
            <span className="text-sm font-medium">
              {userData?.username ? userData.username.charAt(0).toUpperCase() : ''}
            </span>
          </div>
          <figcaption className="ml-3">
            <h3 className="font-semibold text-darkGray">{userData?.username}</h3>
            <p className="text-xs text-primaryGreen">{userData?.role}</p>
          </figcaption>
        </figure>
      </section>

      {/* Navigation */}
      <nav className="p-2 flex-1 overflow-y-auto">
        <ul>
          <li>
            <button
              onClick={() => navigate('/dashboard')}
              className={`flex items-center px-4 py-3 w-full text-left rounded-md cursor-pointer ${
                isActive('/dashboard') 
                  ? 'bg-green-50 text-primaryGreen font-medium' 
                  : 'text-gray-700 hover:bg-green-50'
              }`}
            >
              <Layout className="h-5 w-5 mr-3 text-primaryGreen" />
              <span>Dashboard</span>
            </button>
          </li>

          {/* Inventory */}
          <li className="mb-1">
            <button
              className={`w-full flex items-center justify-between px-4 py-3 rounded-md cursor-pointer ${
                isInActiveGroup('/inventory') 
                  ? 'bg-green-50 text-primaryGreen font-medium' 
                  : 'text-gray-700 hover:bg-green-50'
              }`}
              onClick={() => handleDropdownToggle('inventory')}
              aria-expanded={isInventoryOpen}
            >
              <div className="flex items-center">
                <Package className="h-5 w-5 mr-3 text-primaryGreen" />
                <span>Inventory</span>
              </div>
              {isInventoryOpen ?
                <ChevronUp className="h-4 w-4 text-primaryGreen" /> :
                <ChevronDown className="h-4 w-4 text-primaryGreen" />
              }
            </button>
            {isInventoryOpen && (
              <ul className="bg-primaryGreen text-cleanWhite rounded-md mt-1">
                <li>
                  <button
                    onClick={() => navigate('/inventory/item-list')}
                    className={`block py-3 pl-10 w-full text-left rounded-md cursor-pointer ${
                      isActive('/inventory/item-list') 
                        ? 'bg-darkGreen font-medium' 
                        : 'hover:bg-darkGreen'
                    }`}
                  >
                    List of Medicines
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/inventory/groups')}
                    className={`block py-3 pl-10 w-full text-left rounded-md cursor-pointer ${
                      isActive('/inventory/groups') 
                        ? 'bg-darkGreen font-medium' 
                        : 'hover:bg-darkGreen'
                    }`}
                  >
                    Medicine Groups
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* Transaction */}
          <li>
            <button
              className={`w-full flex items-center justify-between px-4 py-3 rounded-md cursor-pointer ${
                isInActiveGroup('/transaction') 
                  ? 'bg-green-50 text-primaryGreen font-medium' 
                  : 'text-gray-700 hover:bg-green-50'
              }`}
              onClick={() => handleDropdownToggle('transaction')}
              aria-expanded={isTransactionOpen}
            >
              <div className="flex items-center">
                <BarChart2 className="h-5 w-5 mr-3 text-primaryGreen" />
                <span>Transaction</span>
              </div>
              {isTransactionOpen ?
                <ChevronUp className="h-4 w-4 text-primaryGreen" /> :
                <ChevronDown className="h-4 w-4 text-primaryGreen" />
              }
            </button>
            {isTransactionOpen && (
              <ul className="bg-primaryGreen text-cleanWhite rounded-md mt-1">
                <li>
                  <button
                    onClick={() => navigate('/transaction/log')}
                    className={`block py-3 pl-10 w-full text-left rounded-md cursor-pointer ${
                      isActive('/transaction/log') 
                        ? 'bg-darkGreen font-medium' 
                        : 'hover:bg-darkGreen'
                    }`}
                  >
                    Log Transaction
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/transaction/history')}
                    className={`block py-3 pl-10 w-full text-left rounded-md cursor-pointer ${
                      isActive('/transaction/history') 
                        ? 'bg-darkGreen font-medium' 
                        : 'hover:bg-darkGreen'
                    }`}
                  >
                    History
                  </button>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>

      {/* Logout */}
      <footer className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-3 hover:bg-green-50 w-full rounded-md border border-primaryGreen text-primaryGreen cursor-pointer"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Logout</span>
        </button>
      </footer>
    </aside>
  );
}