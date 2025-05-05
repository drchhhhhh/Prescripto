import { useState } from 'react';
import { X, Search, Plus, ChevronRight, ChevronDown, Box, Layout, Activity, Settings, Users } from "lucide-react";
import Header from '../../components/Header';

// Define types for our data
interface Medication {
  id: number;
  name: string;
  description: string;
  stock: number;
  price: number;
}

interface MedicineGroup {
  id: number;
  name: string;
  icon: string;
  color: string;
  borderColor: string;
  description: string;
  medications: Medication[];
}

// Mock data for medicine groups and medications
const medicineGroupsData: MedicineGroup[] = [
  {
    id: 1,
    name: "Antibiotics",
    icon: "💊",
    color: "bg-green-50",
    borderColor: "border-primaryGreen",
    description: "Medications that fight bacterial infections",
    medications: [
      { id: 101, name: "Amoxicillin", description: "Broad-spectrum antibiotic", stock: 145, price: 8.99 },
      { id: 102, name: "Azithromycin", description: "Macrolide antibiotic", stock: 89, price: 12.50 },
      { id: 103, name: "Ciprofloxacin", description: "Fluoroquinolone antibiotic", stock: 63, price: 15.75 },
      { id: 104, name: "Doxycycline", description: "Tetracycline antibiotic", stock: 112, price: 6.99 },
    ]
  },
  {
    id: 2,
    name: "Pain Relievers",
    icon: "🩹",
    color: "bg-green-50",
    borderColor: "border-primaryGreen",
    description: "Medications that reduce pain and inflammation",
    medications: [
      { id: 201, name: "Ibuprofen", description: "NSAID pain reliever", stock: 230, price: 5.49 },
      { id: 202, name: "Acetaminophen", description: "Non-NSAID pain reliever", stock: 187, price: 4.99 },
      { id: 203, name: "Naproxen", description: "Long-acting NSAID", stock: 94, price: 7.25 },
    ]
  },
  {
    id: 3,
    name: "Antihypertensives",
    icon: "❤️",
    color: "bg-green-50",
    borderColor: "border-primaryGreen",
    description: "Medications for high blood pressure",
    medications: [
      { id: 301, name: "Lisinopril", description: "ACE inhibitor", stock: 78, price: 9.99 },
      { id: 302, name: "Amlodipine", description: "Calcium channel blocker", stock: 65, price: 8.50 },
      { id: 303, name: "Losartan", description: "Angiotensin II receptor blocker", stock: 120, price: 10.75 },
    ]
  },
  {
    id: 4,
    name: "Antihistamines",
    icon: "🌼",
    color: "bg-green-50",
    borderColor: "border-primaryGreen",
    description: "Medications for allergies",
    medications: [
      { id: 401, name: "Cetirizine", description: "Second-generation antihistamine", stock: 156, price: 8.99 },
      { id: 402, name: "Diphenhydramine", description: "First-generation antihistamine", stock: 134, price: 5.50 },
    ]
  },
  {
    id: 5,
    name: "Antidiabetics",
    icon: "🍬",
    color: "bg-green-50",
    borderColor: "border-primaryGreen",
    description: "Medications for diabetes management",
    medications: [
      { id: 501, name: "Metformin", description: "Oral diabetes medication", stock: 98, price: 6.99 },
      { id: 502, name: "Glipizide", description: "Sulfonylurea medication", stock: 57, price: 9.50 },
    ]
  }
];

// Custom icons for the medicine groups
const groupIcons = {
  1: <Box className="w-6 h-6 text-primaryGreen" />,
  2: <Activity className="w-6 h-6 text-yellow-500" />,
  3: <Activity className="w-6 h-6 text-red-500" />,
  4: <Layout className="w-6 h-6 text-blue-500" />,
  5: <Settings className="w-6 h-6 text-purple-500" />,
};

export default function InventoryGroups() {
  const [query, setQuery] = useState<string>("");
  const [expandedGroups, setExpandedGroups] = useState<number[]>([]);
  const [showNewGroupModal, setShowNewGroupModal] = useState<boolean>(false);

  const toggleGroupExpansion = (groupId: number) => {
    if (expandedGroups.includes(groupId)) {
      setExpandedGroups(expandedGroups.filter(id => id !== groupId));
    } else {
      setExpandedGroups([...expandedGroups, groupId]);
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

  return (
    <>
      <Header />
      <main className="flex flex-col bg-primaryBG w-full min-h-screen font-poppins pl-64">
        <div className="w-full max-w-7xl mx-auto px-5 flex flex-col flex-1 py-6">
          {/* Top Section - Match dashboard layout */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-darkGray">Inventory</h1>
                <ChevronRight className="w-5 h-5 text-gray-400" />
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
            <div className="flex items-center w-full max-w-md bg-cleanWhite border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="Search medicine groups..."
                className="flex-grow bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
              />
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
                        {group.medications.length} items
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
                              <button className="text-sm bg-primaryGreen text-cleanWhite px-3 py-1 rounded-md hover:bg-darkGreen transition-colors">
                                Add to Cart
                              </button>
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
                  {medicineGroupsData.reduce((acc, group) => acc + group.medications.length, 0)}
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
      {showNewGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-darkGray">Add New Medicine Group</h3>
              <button 
                onClick={() => setShowNewGroupModal(false)}
                className="p-1 text-gray-500 hover:text-primaryGreen transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primaryGreen focus:border-primaryGreen"
                    placeholder="Enter group name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primaryGreen focus:border-primaryGreen"
                    placeholder="Enter description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primaryGreen focus:border-primaryGreen"
                      placeholder="Emoji icon"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <select className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primaryGreen focus:border-primaryGreen">
                      <option>Green</option>
                      <option>Blue</option>
                      <option>Yellow</option>
                      <option>Red</option>
                      <option>Purple</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end p-4 border-t border-gray-200 gap-2">
              <button 
                onClick={() => setShowNewGroupModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-darkGray hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-primaryGreen text-cleanWhite rounded-md hover:bg-darkGreen transition-colors"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}