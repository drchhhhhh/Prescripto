"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaMagnifyingGlass, FaChevronDown } from "react-icons/fa6"
import Header from "../../components/Header"

type Medicine = {
  id: string
  name: string
  currentStock: number
  minimumStock: number
  maximumStock: number
  status: "low" | "moderate" | "high"
  supplier: string
  lastUpdated: string
}

type SortDirection = "asc" | "desc" | "none"
type SortableField = "id" | "name" | "currentStock" | "status" | "supplier" | "lastUpdated"

const StockStatus = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    field: SortableField
    direction: SortDirection
  }>({ field: "status", direction: "asc" })
  const [filterOption, setFilterOption] = useState<string>("all")
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null)
  const [newStockAmount, setNewStockAmount] = useState<string>("")
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  useEffect(() => {
    const fetchMedicines = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const mockData: Medicine[] = [
        { 
          id: "MED001", 
          name: "Augmentin 625 Duo", 
          currentStock: 5, 
          minimumStock: 10, 
          maximumStock: 100,
          status: "low", 
          supplier: "ABC Pharmaceuticals",
          lastUpdated: "2025-04-20" 
        },
        { 
          id: "MED002", 
          name: "Azithral 500 Tablet", 
          currentStock: 8, 
          minimumStock: 10, 
          maximumStock: 100,
          status: "low", 
          supplier: "MediCorp Ltd.",
          lastUpdated: "2025-04-21" 
        },
        { 
          id: "MED003", 
          name: "Ascoril LS Syrup", 
          currentStock: 15, 
          minimumStock: 10, 
          maximumStock: 50,
          status: "moderate", 
          supplier: "PharmaCare Inc.",
          lastUpdated: "2025-04-22" 
        },
        { 
          id: "MED004", 
          name: "Azee 500 Tablet", 
          currentStock: 25, 
          minimumStock: 10, 
          maximumStock: 60,
          status: "moderate", 
          supplier: "MediCorp Ltd.",
          lastUpdated: "2025-04-19" 
        },
        { 
          id: "MED005", 
          name: "Allegra 120mg Tablet", 
          currentStock: 3, 
          minimumStock: 15, 
          maximumStock: 100,
          status: "low", 
          supplier: "HealthFirst Suppliers",
          lastUpdated: "2025-04-18" 
        },
      ]
      setMedicines(mockData)
      setFilteredMedicines(mockData)
    }
    fetchMedicines()
  }, [])

  useEffect(() => {
    let filtered = medicines.filter(
      (medicine) =>
        medicine.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.status.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Apply status filter
    if (filterOption !== "all") {
      filtered = filtered.filter(medicine => medicine.status === filterOption)
    }

    setFilteredMedicines(filtered)
  }, [searchTerm, medicines, filterOption])

  useEffect(() => {
    if (sortConfig.direction === "none") {
      return
    }
    
    const sortedMedicines = [...filteredMedicines].sort((a, b) => {
      let aValue: any = a[sortConfig.field]
      let bValue: any = b[sortConfig.field]
      
      if (sortConfig.field === "lastUpdated") {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }
      
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
      return 0
    })
    
    setFilteredMedicines(sortedMedicines)
  }, [sortConfig])

  const handleFilterSelect = (option: string) => {
    setFilterOption(option)
    setIsFilterOpen(false)
  }

  const updateStock = (medicine: Medicine) => {
    setEditingMedicine(medicine)
    setNewStockAmount(medicine.currentStock.toString())
    setIsModalOpen(true)
  }

  const handleStockUpdate = () => {
    if (!editingMedicine) return
    
    const stockAmount = parseInt(newStockAmount)
    if (isNaN(stockAmount) || stockAmount < 0) return
    
    const updatedMedicines = medicines.map(med => {
      if (med.id === editingMedicine.id) {
        let status: "low" | "moderate" | "high" = "low"
        
        if (stockAmount >= med.minimumStock && stockAmount < med.maximumStock * 0.8) {
          status = "moderate"
        } else if (stockAmount >= med.maximumStock * 0.8) {
          status = "high"
        }
        
        return {
          ...med,
          currentStock: stockAmount,
          status: status,
          lastUpdated: new Date().toISOString().split('T')[0]
        }
      }
      return med
    })
    
    setMedicines(updatedMedicines)
    setIsModalOpen(false)
    setEditingMedicine(null)
  }

  const getStatusClass = (status: string) => {
    switch(status) {
      case "low":
        return "bg-red-100 text-red-800"
      case "moderate":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <>
      <Header />
      <main className="flex flex-col bg-primaryBG w-full min-h-screen font-poppins">
        <div className="w-full max-w-7xl mx-auto px-5 flex flex-col flex-1">
          {/* Top Section */}
          <section className="flex flex-row justify-between items-center py-5">
            <div className="flex flex-col">
              <div className="flex flex-row gap-2 items-center">
                <Link className="text-darkGray text-2xl font-bold" to="/inventory">
                  Inventory
                </Link>
                <h1 className="text-darkGray text-xl font-bold">{">"}</h1>
                <h1 className="text-darkGreen text-2xl font-bold">Medicine Shortage</h1>
              </div>
              <h3 className="text-gray-600">Manage stock levels and resolve medicine shortages.</h3>
            </div>
            <Link
              className="bg-primaryGreen rounded-md p-2 text-cleanWhite cursor-pointer hover:bg-darkGreen ease-in duration-100"
              to="/inventory/add"
            >
              + Add New Medicine
            </Link>
          </section>

          {/* Search and Filter */}
          <section className="flex flex-row justify-between items-center mt-2">
            <form
              className="flex items-center w-full max-w-md bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 shadow-sm"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="text"
                placeholder="Search medicines..."
                className="flex-grow bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="text-gray-500 hover:text-gray-700 transition" aria-label="Search">
                <FaMagnifyingGlass />
              </button>
            </form>

            <div className="relative">
              <button
                className="flex items-center justify-between bg-white border border-gray-300 rounded-md px-4 py-2 min-w-[200px]"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <span className="text-gray-700">
                  {filterOption === "all"
                    ? "All Stock Levels"
                    : filterOption === "low"
                      ? "Low Stock"
                      : filterOption === "moderate"
                        ? "Moderate Stock"
                        : "High Stock"}
                </span>
                <FaChevronDown className="ml-2 text-gray-500" />
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  <ul>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                      onClick={() => handleFilterSelect("all")}
                    >
                      All Stock Levels
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                      onClick={() => handleFilterSelect("low")}
                    >
                      Low Stock
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                      onClick={() => handleFilterSelect("moderate")}
                    >
                      Moderate Stock
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                      onClick={() => handleFilterSelect("high")}
                    >
                      High Stock
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* Medicines Table */}
          <section className="flex flex-col shadow bg-cleanWhite rounded-sm border-2 border-gray-400 mt-5 flex-1 max-h-[400px]">
            <div className="overflow-auto h-full">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Medicine ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Supplier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMedicines.length > 0 ? (
                    filteredMedicines.map((medicine, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{medicine.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{medicine.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {medicine.currentStock} / {medicine.maximumStock}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(medicine.status)}`}>
                            {medicine.status.charAt(0).toUpperCase() + medicine.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{medicine.supplier}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{medicine.lastUpdated}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <button
                            onClick={() => updateStock(medicine)}
                            className="bg-primaryGreen text-white py-1 px-3 rounded hover:bg-darkGreen transition"
                          >
                            Update Stock
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
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

      {/* Update Stock Modal */}
      {isModalOpen && editingMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Update Stock for {editingMedicine.name}</h2>
            
            <div className="mb-4">
              <p className="mb-2 text-sm text-gray-600">Current Stock: {editingMedicine.currentStock}</p>
              <p className="mb-2 text-sm text-gray-600">Minimum Stock: {editingMedicine.minimumStock}</p>
              <p className="mb-4 text-sm text-gray-600">Maximum Stock: {editingMedicine.maximumStock}</p>
              
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">
                New Stock Amount:
              </label>
              <input
                id="stock"
                type="number"
                min="0"
                value={newStockAmount}
                onChange={(e) => setNewStockAmount(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleStockUpdate}
                className="bg-primaryGreen hover:bg-darkGreen text-white font-bold py-2 px-4 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default StockStatus