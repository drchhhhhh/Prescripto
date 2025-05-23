"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Plus, Minus, Trash2 } from "lucide-react"
import Header from "../../components/Header"
import TransactionModal from "../../components/TransactionModal"
import { endpoints } from "../../config/config"

export interface MedicineItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface RawMedicine {
  id: string
  nameGroup: string
  items: {
    _id: string
    expirationDate: string
    price: string
    quantity: string
  }[]
}

const TransactionForm = () => {
  const [medicineItems, setMedicineItems] = useState<MedicineItem[]>([{ id: "1", name: "", price: 0, quantity: 1 }])
  const [taxPercentage, setTaxPercentage] = useState(0.12)
  const [showModal, setShowModal] = useState(false)
  const [isTransactionValid, setIsTransactionValid] = useState(true)
  const [rawMedicines, setRawMedicines] = useState<RawMedicine[]>([])
  const [transactionData, setTransactionData] = useState(null);
  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await fetch(endpoints.getGroupedMedAll, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        const data: RawMedicine[] = await res.json()
        setRawMedicines(data)
        console.log(data)
      } catch (err) {
        console.error("Failed to fetch medicines", err)
      }
    }

    fetchMedicines()
  }, [])

  const addNewItem = () => {
    setMedicineItems([...medicineItems, { id: Date.now().toString(), name: "", price: 0, quantity: 1 }])
  }

  const removeItem = (id: string) => {
    // Only remove the item if there would still be at least one item left
    if (medicineItems.length > 1) {
      setMedicineItems(medicineItems.filter((item) => item.id !== id))
    }
  }

  const updateItemField = (id: string, field: keyof MedicineItem, value: string | number) => {
    setMedicineItems(medicineItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const incrementQuantity = (id: string) => {
    setMedicineItems(medicineItems.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)))
  }

  const decrementQuantity = (id: string) => {
    setMedicineItems(
      medicineItems.map((item) =>
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item,
      ),
    )
  }

  const subtotal = medicineItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const taxAmount = subtotal * taxPercentage
  const totalAmount = subtotal + taxAmount

  const submitTransaction = async () => {
    const hasEmptyNames = medicineItems.some((item) => !item.name.trim())
    setIsTransactionValid(!hasEmptyNames)

    if (hasEmptyNames) {
      setShowModal(true);
      return
    }

    try {
      const items = medicineItems.map((item) => {
        const matchedMed = rawMedicines.find((med) => med.nameGroup === item.name)
        const nearestItem = matchedMed?.items.reduce((earliest, current) =>
          new Date(current.expirationDate) < new Date(earliest.expirationDate)
            ? current
            : earliest
        )

        console.log(nearestItem)

        return {
          medicineId: nearestItem?._id,
          quantity: item.quantity,
        }
      }).filter(item => item.medicineId)

      if (items.length === 0) {
        alert("No valid medicines selected.")
        return
      }

      const payload = {
        items,
        notes: "Test"
      }

      const response = await fetch(endpoints.createTransac, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Failed to save transaction", errorData)
        alert("Transaction failed: " + errorData.message)
        return
      }

      const result = await response.json()
      console.log("Transaction saved:", result)
      setTransactionData(result);
      setMedicineItems([{ id: "1", name: "", price: 0, quantity: 1 }])
    } catch (error) {
      console.error("Error submitting transaction:", error)
      alert("Unexpected error occurred.")
    }
  }
  
  useEffect(() => {
    if (transactionData) {
      console.log("IEIEIEIE2", transactionData)
      setShowModal(true);
    }
  }, [transactionData]);

  const dismissModal = () => {
    setShowModal(false)
    if (isTransactionValid) {
      // Reset to a single default item after successful transaction
      setMedicineItems([{ id: "1", name: "", price: 0, quantity: 1 }])
    }
  }

  const capitalizeWords = (str: string) =>
  str.replace(/\b\w/g, char => char.toUpperCase())

  return (
    <>
      <Header />
      <main className="bg-primaryBG s hadow-sm relative font-poppins pl-64 flex flex-col h-[calc(100vh-80px)] p-0">
        {" "}
        <section className="p-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <div className="flex flex-row gap-2 items-center">
                <h1 className="text-darkGray text-2xl font-bold">
                  Transaction
                </h1>
                  <h1 className="text-darkGray text-xl font-bold">{">"}</h1>
                  <h1 className="text-darkGreen text-2xl font-bold">Transaction Log</h1>
              </div>
            </div>
            <button
              onClick={addNewItem}
              className="flex items-center px-4 py-2 bg-primaryGreen hover:bg-darkGreen ease-in duration-100 text-cleanWhite rounded-md"
            >
              <Plus className="w-5 h-5 mr-1" />
              Add Field
            </button>
          </div>

          <section className="mt-6 flex-grow overflow-y-auto">
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

            <ul className="space-y-4">
              {medicineItems.map((item, index) => (
                <li key={item.id} className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primaryGreen"
                      value={item.name}
                      onChange={(e) => {
                        const selectedName = e.target.value
                        const selectedMed = rawMedicines.find(med => med.nameGroup === selectedName)

                        if (selectedMed && selectedMed.items.length > 0) {
                          const nearest = selectedMed.items.reduce((earliest, current) =>
                            new Date(current.expirationDate) < new Date(earliest.expirationDate)
                              ? current
                              : earliest
                          )
                          const price = parseFloat(nearest.price) || 0

                          setMedicineItems(prev =>
                            prev.map(m =>
                              m.id === item.id ? { ...m, name: selectedName, price } : m
                            )
                          )
                        } else {
                          // If no valid items, still update name and reset price
                          setMedicineItems(prev =>
                            prev.map(m =>
                              m.id === item.id ? { ...m, name: selectedName, price: 0 } : m
                            )
                          )
                        }
                      }}
                    >
                      <option value="">Select a medicine...</option>
                      {rawMedicines.map((med) => {
                        const nearestItem = med.items.reduce((earliest, current) =>
                          new Date(current.expirationDate) < new Date(earliest.expirationDate)
                            ? current
                            : earliest
                        , med.items[0])

                        const expDate = nearestItem?.expirationDate
                          ? new Date(nearestItem.expirationDate).toLocaleDateString()
                          : "N/A"

                        return (
                          <option key={med.id} value={med.nameGroup}>
                            {capitalizeWords(med.nameGroup)} (Exp: {expDate})
                          </option>
                        )
                      })}
                    </select>
                  </div>
                  <div className="col-span-3 w-full p-2 border border-gray-200 bg-gray-100 rounded-md text-gray-700">
                    {item.price.toFixed(2)}
                  </div>
                  <div className="col-span-3 flex items-center">
                    <button
                      onClick={() => decrementQuantity(item.id)}
                      className="p-1 rounded-full bg-green-50 text-green-600"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <input
                      type="text"
                      className="w-16 mx-2 p-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primaryGreen"
                      value={item.quantity}
                      onChange={(e) => updateItemField(item.id, "quantity", Number.parseInt(e.target.value) || 1)}
                    />
                    <button
                      onClick={() => incrementQuantity(item.id)}
                      className="p-1 rounded-full bg-green-50 text-green-600"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                    {/* Show delete button only if there's more than one item */}
                    {medicineItems.length > 1 && (
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-2 p-1 rounded-full bg-red-50 text-red-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </section>
        <footer className="mt-auto p-6 border-t border-gray-100">
          <div className="flex flex-row justify-between">
            <article className="bg-green-50 p-6 rounded-lg w-2/3">
              <div className="ml-auto">
                <div className="mb-2 flex justify-between">
                  <span className="font-medium">Subtotal</span>
                  <span>{subtotal.toFixed(2)}</span>
                </div>
                <div className="mb-2 flex justify-between">
                  <span>Tax (12%)</span>
                  <span>{taxAmount.toFixed(2)}</span>
                </div>
                <div className="mt-3 flex justify-between">
                  <span className="text-primaryGreen font-bold text-xl">Total</span>
                  <span className="text-primaryGreen font-bold text-xl">{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </article>

            <aside className="w-1/3 pl-6 flex flex-col justify-center space-y-3">
              <button
                onClick={submitTransaction}
                className="px-8 py-3 bg-primaryGreen hover:bg-darkGreen rounded-md text-cleanWhite"
              >
                Save Transaction
              </button>
              <button className="px-8 py-3 bg-gray-300 hover:bg-gray-400 rounded-md text-gray-700">Cancel</button>
            </aside>
          </div>

          <TransactionModal
            show={showModal}
            valid={isTransactionValid}
            items={medicineItems}
            subtotal={subtotal}
            total={totalAmount}
            receiptNumber=""
            transacData={transactionData}
            onClose={dismissModal}
          />
        </footer>
      </main>
    </>
  )
}

export default TransactionForm