//aayusin pa itsura
"use client"

import type React from "react"

import { X, CheckCircle, AlertCircle } from "lucide-react"
import type { MedicineItem } from "../pages/Transaction/TransactionLog"

interface TransactionModalProps {
  show: boolean
  valid: boolean
  items: MedicineItem[]
  subtotal: number
  taxAmount: number
  discount: number
  total: number
  receiptNumber: string
  onClose: () => void
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  show,
  valid,
  items,
  subtotal,
  taxAmount,
  discount,
  total,
  receiptNumber,
  onClose,
}) => {
  if (!show) return null

  const now = new Date()
  const formattedDate = now.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  })
  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })

  return (
    <div className="fixed inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-50">
      <div className="absolute"></div>
      {valid ? (
        <article className="w-[900px] h-[500px] bg-green-50 rounded-lg p-6 max-w-2xl z-10 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-700 hover:text-black">
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-semibold text-center mb-6">Transaction Details</h2>
          <section className="flex justify-between mb-6">
            <div>
              <p className="font-medium">Date & Time</p>
              <p>
                {formattedDate} | {formattedTime}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">Receipt No.</p>
              <p>{receiptNumber}</p>
            </div>
          </section>
          <div className="grid grid-cols-2 gap-8">
            <section>
              <div className="mb-4">
                <table className="w-full">
                  <thead>
                    <tr className="font-medium mb-2">
                      <th className="text-left w-1/6">QTY.</th>
                      <th className="text-left w-1/2">ITEM</th>
                      <th className="text-right w-1/3">PRICE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="mb-2">
                        <td className="text-left">{item.quantity}</td>
                        <td className="text-left">{item.name}</td>
                        <td className="text-right">{item.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <dl className="mt-8">
                <div className="flex justify-between mb-1">
                  <dt className="font-medium">Subtotal</dt>
                  <dd>{subtotal.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between mb-1">
                  <dt>Tax (12%)</dt>
                  <dd>{taxAmount.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between mb-1">
                  <dt>Discount</dt>
                  <dd>{discount.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between text-green-600 font-bold">
                  <dt>Total</dt>
                  <dd>{total.toFixed(2)}</dd>
                </div>
              </dl>
            </section>
            <section className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-green-600 flex items-center justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
              <p className="text-2xl font-bold text-center mb-8">Transaction Logged!</p>
              <button onClick={onClose} className="px-8 py-3 bg-green-600 rounded-full text-white hover:bg-green-700">
                Return
              </button>
            </section>
          </div>
        </article>
      ) : (
        <article className="w-[900px] h-[500px] bg-white rounded-lg p-8 z-10 flex flex-col items-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-700 hover:text-black">
            <X className="w-6 h-6" />
          </button>
          <div className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center mb-6">
            <AlertCircle className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-4">Error Logging Transaction</h2>
          <p className="text-center text-gray-700 mb-6">Please make sure all required fields are filled correctly.</p>
          <button onClick={onClose} className="px-8 py-3 bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300">
            Close
          </button>
        </article>
      )}
    </div>
  )
}

export default TransactionModal
