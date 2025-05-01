import React from 'react'

const InventoryPage = () => {
  return (
    <main className="bg-gray-100 w-100 h-100">
        <section className='w-100 flex flex-row'>
            <div className="flex flex-col">
                <h1 className='text-darkGray text-2xl font-bold'>Inventory</h1>
                <h3>List of medicines available for sale.</h3>
            </div>
            <button className='bg-darkGreen rounded-md p-2 text-cleanWhite'>Add New Item</button>
        </section>
    </main>
  )
}

export default InventoryPage