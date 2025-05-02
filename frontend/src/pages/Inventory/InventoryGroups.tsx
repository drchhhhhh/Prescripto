import React from 'react'
import { Link } from 'react-router'
import { FaMagnifyingGlass } from "react-icons/fa6";

const InventoryGroups = () => {
  return (
    <main className="bg-primaryBG w-full min-h-screen p-5">
            {/* Top Section */}
            <section className='w-full flex flex-row justify-between items-center'>
                <div className="flex flex-col">
                    <div className="flex flex-row gap-2 items-center">
                        <Link className='text-darkGray text-2xl font-bold' to="/inventory">Inventory</Link>
                        <h1 className='text-darkGray text-xl font-bold'>{'>'}</h1>
                        <h1 className='text-darkGreen text-2xl font-bold'>Medicine Groups </h1> {/* Add a counter of how many medicines are in the inv */}
                    </div>
                    <h3>List of medicines available for sale.</h3>
                </div>
                {/* Add a popup form for Group Creation */}
                <button className='bg-primaryGreen rounded-md p-2 text-cleanWhite cursor-pointer hover:bg-darkGreen ease-in duration-100'>+ Add New Item</button>
            </section>

            {/* Search and Filter Section */}
            <section className='flex flex-row justify-between items-center mt-2'>
                <form // onSubmit={handleSearch}
                    className="flex items-center w-full max-w-md bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 shadow-sm" >
                    <input
                        type="text"
                        // value={query}
                        // onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search Groups..."
                        className="flex-grow bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                    />
                    <button type="submit" className="text-gray-500 hover:text-gray-700 transition" aria-label="Search" >
                        <FaMagnifyingGlass />
                    </button>
                </form>
            </section>

            {/* Groups Display Section */}
            <section className='flex flex-col shadow bg-cleanWhite rounded-sm border-2 border-gray-400 w-full h-100 mt-5'>
                {/* I think need ng table here but I still don't know cuz may dynamic tayo need magaadd yugn items */}
                <div>
                    {/* Table Header with clickable cols to sort the items respectively */}
                </div>
            </section>
        </main>
  )
}

export default InventoryGroups
