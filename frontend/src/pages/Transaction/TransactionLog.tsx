"use client"

import { useState } from "react"
import { Plus, Minus, Trash2 } from "lucide-react"
import TransactionModal from "../../components/TransactionModal"

export interface MedicineItem {
  id: string
  name: string
  price: number
  quantity: number
}

const TransactionForm = () => {
  const [medicineItems, setMedicineItems] = useState<MedicineItem[]>([
    { id: "1", name: "", price: 0, quantity: 1 }
  ])
  const [taxPercentage, setTaxPercentage] = useState(0.12)
  const [discountValue, setDiscountValue] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [isTransactionValid, setIsTransactionValid] = useState(true)
  const [receiptNumber, setReceiptNumber] = useState("001")

  const addNewItem = () => {
    setMedicineItems([
      ...medicineItems,
      { id: Date.now().toString(), name: "", price: 0, quantity: 1 }
    ])
  }

  const removeItem = (id: string) => {
    setMedicineItems(medicineItems.filter((item) => item.id !== id))
  }

  const updateItemField = (id: string, field: keyof MedicineItem, value: string | number) => {
    setMedicineItems(
      medicineItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  const incrementQuantity = (id: string) => {
    setMedicineItems(
      medicineItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  const decrementQuantity = (id: string) => {
    setMedicineItems(
      medicineItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    )
  }

  const subtotal = medicineItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const taxAmount = subtotal * taxPercentage
  const totalAmount = subtotal + taxAmount - discountValue

  const submitTransaction = () => {
    const hasEmptyNames = medicineItems.some((item) => !item.name.trim())
    setIsTransactionValid(!hasEmptyNames)
    setShowModal(true)
  }

  const dismissModal = () => {
    setShowModal(false)
    if (isTransactionValid) {
      setMedicineItems([{ id: "1", name: "", price: 0, quantity: 1 }])
    }
  }

  return (
    <main className="bg-white rounded-lg shadow-sm relative font-sans"> {/*aayusin ko pa colors*/}
        <section className="p-6">
            <header className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-semibold text-darkGray">
                        Transaction <span className="text-gray-400">&gt;</span>{" "}
                        <span className="text-primaryGreen">Log Transaction</span>
                    </h1>
                    <p className="text-gray-700 mt-1">*All fields are mandatory, except mentioned as (optional).</p>
                </div>
                <button
                    onClick={addNewItem}
                    className="flex items-center px-4 py-2 bg-cleanWhite border border-primaryGreen rounded-full text-primaryGreen hover:bg-lightGreen"
                >
                    <Plus className="w-5 h-5 mr-1" />
                    Add Field
                </button>
            </header>

            <section className="mt-6">
            <div className="grid grid-cols-12 gap-4 mb-2">
                <div className="col-span-6">
                    <label className="block text-gray-700 mb-1">Medicine Name</label>
                </div>
                <div className="col-span-3">
                    <label className="block text-gray-700 mb-1">Unit Price</label>
                </div>
                <div className="col-span-3">
                    <label className="block text-gray-700 mb-1">Quantity</label>
                </div>
            </div>

            <ul>
                {medicineItems.map((item) => (
                <li key={item.id} className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-6">
                        <input
                            type="text"
                            placeholder="Medicine name"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primaryGreen"
                            value={item.name}
                            onChange={(e) => updateItemField(item.id, "name", e.target.value)}
                        />
                    </div>
                    <div className="col-span-3">
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primaryGreen"
                            value={item.price}
                            onChange={(e) => updateItemField(item.id, "price", Number.parseFloat(e.target.value) || 0)}
                        />
                    </div>
                    <div className="col-span-3 flex items-center">
                        <button onClick={() => decrementQuantity(item.id)} className="p-1 rounded-full bg-green-50 text-green-600">
                            <Minus className="w-5 h-5" />
                        </button>
                        <input
                            type="text"
                            className="w-16 mx-2 p-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primaryGreen"
                            value={item.quantity}
                            onChange={(e) => updateItemField(item.id, "quantity", Number.parseInt(e.target.value) || 1)}
                        />
                        <button onClick={() => incrementQuantity(item.id)} className="p-1 rounded-full bg-green-50 text-green-600">
                            <Plus className="w-5 h-5" />
                        </button>
                        <button onClick={() => removeItem(item.id)} className="ml-2 p-1 rounded-full bg-red-50 text-red-500">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </li>
                ))}
            </ul>
            </section>
        </section>

        <footer className="flex p-6 mb-6">
            <section className="w-2/3 bg-green-50 p-6 rounded-lg">
                <div className="ml-auto">
                    <div className="mb-2 flex justify-between">
                        <span className="font-medium">Subtotal</span>
                        <span>{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="mb-2 flex justify-between">
                        <span>Tax (12%)</span>
                        <span>{taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="mb-2 flex justify-between">
                        <span>Discount</span>
                        <span>{discountValue.toFixed(2)}</span>
                    </div>
                    <div className="mt-3 flex justify-between">
                        <span className="text-primaryGreen font-bold text-xl">Total</span>
                        <span className="text-primaryGreen font-bold text-xl">{totalAmount.toFixed(2)}</span>
                    </div>
                </div>
            </section>

            <section className="w-1/3 pl-6 flex flex-col justify-center space-y-3">
                <button onClick={submitTransaction} className="px-8 py-3 bg-primaryGreen hover:bg-darkGreen rounded-full text-cleanWhite">
                    Save Transaction
                </button>
                <button className="px-8 py-3 bg-gray-300 hover:bg-gray-400 rounded-full text-gray-700">
                    Cancel
                </button>
            </section>

            <TransactionModal
                show={showModal}
                valid={isTransactionValid}
                items={medicineItems}
                subtotal={subtotal}
                taxAmount={taxAmount}
                discount={discountValue}
                total={totalAmount}
                receiptNumber={receiptNumber}
                onClose={dismissModal}
            />
        </footer>
    </main>
  )
}

export default TransactionForm