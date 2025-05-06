import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaMagnifyingGlass, FaSort, FaSortUp, FaSortDown } from "react-icons/fa6";
import Header from '../../components/Header';
import { endpoints } from '../../config/config';

type Medicine = {
  name: string;
  id: string;
  group: string;
  stock: number;
};

type SortDirection = 'asc' | 'desc' | 'none';
type SortableField = 'name' | 'id' | 'group' | 'stock';

const InventoryItems = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    field: SortableField;
    direction: SortDirection;
  }>({ field: 'name', direction: 'none' });
  const token = localStorage.getItem("token")

  useEffect(() => {
    const getAllItems = async () => {
      try {
        const response = await fetch(endpoints.getMedAll, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch medicines');
        }

        const data = await response.json();
        
        const transformedMedicines = data.map((item: any) => ({
          name: item.name,
          id: item.id,
          group: item.category,
          stock: item.quantity
        }));

        setMedicines(transformedMedicines);
        setFilteredMedicines(transformedMedicines);
        
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };

    getAllItems();
  }, [token]);

  // Handle search filtering
  useEffect(() => {
    const filtered = medicines.filter(medicine =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.stock.toString().includes(searchTerm)
    );
    setFilteredMedicines(filtered);
  }, [searchTerm, medicines]);

  // Handle sorting
  const handleSort = (field: SortableField) => {
    let direction: SortDirection = 'asc';
    
    if (sortConfig.field === field) {
      if (sortConfig.direction === 'asc') direction = 'desc';
      else if (sortConfig.direction === 'desc') direction = 'none';
    }
    
    setSortConfig({ field, direction });
  };

  // Apply sorting to filtered medicines
  useEffect(() => {
    if (sortConfig.direction === 'none') {
      setFilteredMedicines([...filteredMedicines]);
      return;
    }

    const sortedMedicines = [...filteredMedicines].sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredMedicines(sortedMedicines);
  }, [sortConfig]);

  const getSortIcon = (field: SortableField) => {
    if (sortConfig.field !== field) return <FaSort className="ml-1 opacity-50" />;
    
    switch (sortConfig.direction) {
      case 'asc':
        return <FaSortUp className="ml-1" />;
      case 'desc':
        return <FaSortDown className="ml-1" />;
      default:
        return <FaSort className="ml-1 opacity-50" />;
    }
  };

  return (
    <>
      <Header />
      <main className="flex flex-col bg-primaryBG w-full min-h-screen font-poppins pl-64">
        
        <div className="w-full max-w-7xl mx-auto px-5 flex flex-col flex-1">
          {/* Top Section */}
          <section className='flex flex-row justify-between items-center py-5'>
            <div className="flex flex-col">
              <div className="flex flex-row gap-2 items-center">
                <Link className='text-darkGray text-2xl font-bold' to="/inventory">Inventory</Link>
                <h1 className='text-darkGray text-xl font-bold'>{'>'}</h1>
                <h1 className='text-darkGreen text-2xl font-bold'>List of Medicines</h1>
              </div>
              <h3 className="text-gray-600">List of medicines available for sale.</h3>
            </div>
            <Link
              className='bg-primaryGreen rounded-md p-2 text-cleanWhite cursor-pointer hover:bg-darkGreen ease-in duration-100'
              to="/inventory/item-list/add"
            >
              + Add New Item
            </Link>
          </section>

          {/* Search and Filter Section */}
          <section className='flex flex-row justify-between items-center mt-2'>
            <form
              className="flex items-center w-full max-w-md bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 shadow-sm"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="text"
                placeholder="Search Medicine Inventory.."
                className="flex-grow bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="text-gray-500 hover:text-gray-700 transition" aria-label="Search">
                <FaMagnifyingGlass />
              </button>
            </form>
          </section>

        {/* Item Display Section - Updated for proper sizing */}
        <section className='flex flex-col shadow bg-cleanWhite rounded-sm border-2 border-gray-400 mt-5 flex-1 max-h-[400px]'>
          <div className="overflow-auto h-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Medicine Name
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center">
                      Medicine ID
                      {getSortIcon('id')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('group')}
                  >
                    <div className="flex items-center">
                      Group Name
                      {getSortIcon('group')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('stock')}
                  >
                    <div className="flex items-center">
                      Stock in Qty
                      {getSortIcon('stock')}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMedicines.length > 0 ? (
                  filteredMedicines.map((medicine, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {medicine.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {medicine.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {medicine.group}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {medicine.stock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Link 
                          to={`/inventory/item-list/item/${medicine.id}`}
                          className="text-primaryGreen hover:text-darkGreen hover:underline"
                        >
                          View Full Detail
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No medicines found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}

export default InventoryItems;