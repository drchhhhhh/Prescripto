import { useEffect, useState } from 'react';
import { Plus, ChevronRight, ChevronDown, Box, Layout, Activity, Users } from "lucide-react";
import { FaMagnifyingGlass} from "react-icons/fa6"
import Header from '../../components/Header';
import AddGroupModal from '../../components/Inventory/InvAddGroupModal'; // adjust path as needed
import { endpoints } from '../../config/config';

// Define types for our data
interface Medication {
  id: number;
  name: string;
  description: string;
  stock: number;
  price: number;
}

interface ApiGroup {
  _id: string;
  id: string;
  name: string;
  description: string;
  emoji: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface MedicineGroup {
  id: string; 
  name: string;
  icon: string;
  color: string;
  borderColor: string;
  description: string;
  medications: Medication[];
  medicineCount: number;
}

export default function InventoryGroups() {
  const [query, setQuery] = useState<string>("");
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [showNewGroupModal, setShowNewGroupModal] = useState<boolean>(false);
  const [medicineGroupsData, setMedicineGroupsData] = useState<MedicineGroup[]>([]);
  const token = localStorage.getItem("token")

  const toggleGroupExpansion = async (groupId: string) => {
    if (expandedGroups.includes(groupId)) {
      setExpandedGroups(expandedGroups.filter(id => id !== groupId));
    } else {
      try {
        // Fetch medications when expanding
        const response = await fetch(`${endpoints.getAllGroups}/${groupId}/medicines`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const medications = await response.json();
        
        setMedicineGroupsData(prev => prev.map(group => 
          group.id === groupId 
            ? { ...group, medications } 
            : group
        ));
        setExpandedGroups([...expandedGroups, groupId]);
      } catch (error) {
        console.error("Failed to fetch medications:", error);
      }
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const filteredGroups = medicineGroupsData.filter(group => 
    group.name.toLowerCase().includes(query.toLowerCase())
  );

  const groupColorClasses = {
    1: "bg-green-50 border-primaryGreen text-primaryGreen",
    2: "bg-yellow-50 border-yellow-500 text-yellow-600",
    3: "bg-red-50 border-red-500 text-red-600",
    4: "bg-blue-50 border-blue-500 text-blue-600",
    5: "bg-purple-50 border-purple-500 text-purple-600",
  };

  const fetchAllGroups = async () => {
    try {
      // First fetch all groups
      const groupsResponse = await fetch(endpoints.getAllGroups, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!groupsResponse.ok) {
        throw new Error(`Error: ${groupsResponse.status}`);
      }

      const apiGroups: ApiGroup[] = await groupsResponse.json();

      // Then fetch medicine counts for each group
      const groupsWithCounts = await Promise.all(
        apiGroups.map(async (group) => {
          const countResponse = await fetch(
            endpoints.getMedicinesCountByGroup.replace(':id', group.id),
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              }
            }
          );

          if (!countResponse.ok) {
            console.error(`Failed to get count for group ${group.id}`);
            return {
              ...group,
              medicineCount: 0
            };
          }

          const countData = await countResponse.json();
          return {
            ...group,
            medicineCount: countData.count || 0
          };
        })
      );

      // Map the API data to your MedicineGroup structure
      const mappedGroups: MedicineGroup[] = groupsWithCounts.map((group, index) => ({
        id: group.id,
        name: group.name,
        icon: group.emoji,
        color: "bg-green-50",
        borderColor: "border-primaryGreen",
        description: group.description,
        medications: [], // Empty array since we're not fetching medications here
        medicineCount: group.medicineCount
      }));

      setMedicineGroupsData(mappedGroups);
    } catch(error) {
      console.error("Failed to fetch groups:", error);
    }
  };

  useEffect(() => {
    fetchAllGroups();
  }, [token]);

  return (
    <>
      <Header />
      <main className="flex flex-col bg-primaryBG w-full min-h-screen font-poppins pl-64">
        <div className="w-full max-w-7xl mx-auto px-5 flex flex-col flex-1 py-5">
          {/* Top Section - Match dashboard layout */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-darkGray">Inventory</h1>
                <h1 className='text-darkGray text-xl font-bold'>{'>'}</h1>
                <h1 className="text-2xl font-bold text-primaryGreen">Medicine Groups</h1>
              </div>
              <p className="text-gray-600 mt-1">Manage and organize your medicine inventory by groups.</p>
            </div>
            
            <button 
              onClick={() => setShowNewGroupModal(true)}
              className="flex items-center px-4 py-2 bg-primaryGreen rounded-md text-cleanWhite hover:bg-darkGreen transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Group
            </button>
          </div>
          
          {/* Search Section */}
          <div className="mb-6">
            <div className="flex items-center w-full max-w-md bg-gray-100 border border-gray-300 rounded-md px-4 py-2 shadow-sm">
              <input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="Search medicine groups..."
                className="flex-grow bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
              />
              <button type="submit" className="text-gray-500 hover:text-gray-700 transition" aria-label="Search">
                <FaMagnifyingGlass />
              </button>
            </div>
          </div>
          
          {/* Medicine Groups - Accordion style */}
          <div className="space-y-4 mb-6">
            {filteredGroups.map((group) => {
              const isExpanded = expandedGroups.includes(group.id);
              const colorClass = groupColorClasses[group.id as keyof typeof groupColorClasses] || "bg-green-50 border-primaryGreen text-primaryGreen";
              
              return (
                <div 
                  key={group.id} 
                  className={`bg-cleanWhite rounded-lg overflow-hidden shadow-sm border ${isExpanded ? 'border-2 border-primaryGreen' : 'border border-gray-200'}`}
                >
                  {/* Group Header */}
                  <div 
                    className={`p-4 flex items-center justify-between cursor-pointer ${isExpanded ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                    onClick={() => toggleGroupExpansion(group.id)}
                  >
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${colorClass.split(' ').filter(c => c.startsWith('bg-')).join(' ')} border`}>
                        <span className="text-2xl">{group.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-darkGray">{group.name}</h3>
                        <p className="text-sm text-gray-600">{group.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
                        {group.medicineCount} items
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                  
                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                        {group.medications.map(med => (
                          <div 
                            key={med.id} 
                            className="bg-white rounded-md p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium text-darkGray">{med.name}</h4>
                              <span className={`text-sm font-medium ${colorClass.split(' ').filter(c => c.startsWith('text-')).join(' ')}`}>
                                ${med.price.toFixed(2)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{med.description}</p>
                            <div className="flex justify-between items-center">
                              <span className={`text-sm px-2 py-1 rounded-full ${colorClass}`}>
                                Stock: {med.stock}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Group Statistics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-cleanWhite rounded-lg overflow-hidden shadow-sm border border-green-100">
              <div className="p-6 flex flex-col items-center">
                <div className="bg-green-50 p-3 rounded-full mb-4">
                  <Box className="w-8 h-8 text-primaryGreen" />
                </div>
                <h2 className="text-2xl font-bold text-darkGray">{medicineGroupsData.length}</h2>
                <p className="text-gray-600 mt-1">Total Groups</p>
              </div>
            </div>
            
            <div className="bg-cleanWhite rounded-lg overflow-hidden shadow-sm border border-blue-100">
              <div className="p-6 flex flex-col items-center">
                <div className="bg-blue-50 p-3 rounded-full mb-4">
                  <Layout className="w-8 h-8 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-darkGray">
                  {medicineGroupsData.reduce((acc, group) => acc + group.medicineCount, 0)}
                </h2>
                <p className="text-gray-600 mt-1">Total Medications</p>
              </div>
            </div>
            
            <div className="bg-cleanWhite rounded-lg overflow-hidden shadow-sm border border-yellow-100">
              <div className="p-6 flex flex-col items-center">
                <div className="bg-yellow-50 p-3 rounded-full mb-4">
                  <Activity className="w-8 h-8 text-yellow-500" />
                </div>
                <h2 className="text-2xl font-bold text-darkGray">
                  {medicineGroupsData.reduce((acc, group) => {
                    const groupTotal = group.medications.reduce((sum, med) => sum + med.stock, 0);
                    return acc + groupTotal;
                  }, 0)}
                </h2>
                <p className="text-gray-600 mt-1">Total Stock</p>
              </div>
            </div>
            
            <div className="bg-cleanWhite rounded-lg overflow-hidden shadow-sm border border-purple-100">
              <div className="p-6 flex flex-col items-center">
                <div className="bg-purple-50 p-3 rounded-full mb-4">
                  <Users className="w-8 h-8 text-purple-500" />
                </div>
                <h2 className="text-2xl font-bold text-darkGray">4</h2>
                <p className="text-gray-600 mt-1">Suppliers</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Add New Group Modal */}
      <AddGroupModal isOpen={showNewGroupModal} onClose={() => setShowNewGroupModal(false)} refreshGroups={fetchAllGroups} />
    </>
  );
}