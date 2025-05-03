import { Link } from 'react-router';
import { useState } from 'react';

const InventoryAddMedicine = () => {
    const [form, setForm] = useState({
        medicineName: "",
        medicineId: "",
        medicineGroup: "",
        quantity: "",
        desc: "",
        sideEffects: "",
    })

    const handleChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> ) => {
        setForm({
          ...form,
          [e.target.name]: e.target.value,
        });
      };
      

    return (
        <main className="bg-primaryBG w-full min-h-screen px-5 pt-2">
            {/* Top Section */}
            <section className='w-full flex flex-row justify-between items-center'>
                <div className="flex flex-col">
                    <div className="flex flex-row gap-2 items-center">
                        <Link className='text-darkGray text-2xl font-bold' to="/inventory">Inventory</Link>
                        <h1 className='text-darkGray text-xl font-bold'>{'>'}</h1>
                        <Link className='text-darkGray text-2xl font-bold' to="/inventory/item-list">List of Medicines</Link>
                        <h1 className='text-darkGray text-xl font-bold'>{'>'}</h1>
                        <h1 className='text-darkGreen text-2xl font-bold'>Add New Medicine</h1>
                    </div>
                    <h3>*All fields are mandatory, except mentioned as {'(optional)'}.</h3>
                </div>
            </section>
            
            <form className="flex flex-col w-full gap-4 mt-4">
                <div className="flex flex-wrap gap-4">
                    {/* Medicine Name */}
                    <div className="flex flex-col flex-1 min-w-[200px]">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            Medicine Name*
                        </label>
                        <input
                            type="text"
                            name="medicineName"
                            onChange={handleChange}
                            className="px-3 py-2 border border-gray-300 rounded-md bg-inputBG focus:outline-none focus:ring-2 focus:ring-primaryGreen"
                        />
                    </div>

                    {/* Medicine ID */}
                    <div className="flex flex-col flex-1 min-w-[200px]">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            Medicine ID*
                        </label>
                        <input
                            type="text"
                            name="medicineId"
                            onChange={handleChange}
                            className="px-3 py-2 border border-gray-300 rounded-md bg-inputBG focus:outline-none focus:ring-2 focus:ring-primaryGreen"
                        />
                    </div>
                </div>
                <div className="flex flex-wrap gap-4">
                    {/* Medicine Group (Dropdown) */}
                    <div className="flex flex-col flex-1 min-w-[200px]">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            Medicine Group {"(Optional)"}
                        </label>
                        <select
                            name="medicineGroup"
                            onChange={handleChange}
                            className="px-3 py-2 border border-gray-300 rounded-md bg-inputBG focus:outline-none focus:ring-2 focus:ring-primaryGreen"
                        >
                            <option value="">- Select Group -</option>
                            {/* Create a map that would put all the created groups here */}
                        </select>
                    </div>

                    {/* Quantity */}
                    <div className="flex flex-col flex-1 min-w-[200px]">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            Quantity in Number*
                        </label>
                        <input
                            type="text"
                            name="quantity"
                            onChange={handleChange}
                            className="px-3 py-2 border border-gray-300 rounded-md bg-inputBG focus:outline-none focus:ring-2 focus:ring-primaryGreen"
                        />
                    </div>
                </div>
                {/* How to Use */}
                <div className="flex flex-col flex-1 min-w-[200px]">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                        How to Use*
                    </label>
                    <input
                        type="text"
                        name="desc"
                        onChange={handleChange}
                        className="px-3 py-2 border border-gray-300 rounded-md bg-inputBG focus:outline-none focus:ring-2 focus:ring-primaryGreen h-38"
                    />
                </div>
                
                {/* Side Effects */}
                <div className="flex flex-col flex-1 min-w-[200px]">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                        Side Effects*
                    </label>
                    <input
                        type="text"
                        name="sideEffects"
                        onChange={handleChange}
                        className="px-3 py-2 border border-gray-300 rounded-md bg-inputBG focus:outline-none focus:ring-2 focus:ring-primaryGreen h-38"
                    />
                </div>
                <button className='bg-primaryGreen rounded-md p-2 text-cleanWhite cursor-pointer hover:bg-darkGreen ease-in duration-100'>Add Item</button>
            </form>
        </main>
    );
}

export default InventoryAddMedicine
