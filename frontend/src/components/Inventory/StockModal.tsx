// components/StockModal.tsx
import React from "react"
import { Medicine } from "../../pages/Inventory/StockStatus" // adjust path if needed


type Props = {
  medicine: Medicine | null
  newStockAmount: string
  setNewStockAmount: (value: string) => void
  onClose: () => void
  onSubmit: () => void
  isOpen: boolean
}


const StockModal: React.FC<Props> = ({
  medicine,
  newStockAmount,
  setNewStockAmount,
  onClose,
  onSubmit,
  isOpen,
}) => {
  if (!isOpen || !medicine) return null


  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 font-poppins">
      <div className="bg-white rounded-lg p-6 shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Update Stock for {medicine.name}</h2>
        <input
          type="number"
          value={newStockAmount}
          onChange={(e) => setNewStockAmount(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  )
}


export default StockModal



