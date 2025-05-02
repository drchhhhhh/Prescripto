import { Link } from 'react-router';
import { useState } from 'react';

const InventoryAddMedicine = () => {
    const [medicineName, setMedicineName] = useState()

    return (
        <main className="bg-primaryBG w-full min-h-screen p-5">
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
                <button className='bg-primaryGreen rounded-md p-2 text-cleanWhite cursor-pointer hover:bg-darkGreen ease-in duration-100'>+ Add New Item</button>
            </section>
            
            <section>
                <form action="submit" className='flex flex-col gap-2'>
                    <div className="flex flex-row">

                    </div>
                </form>
            </section>
        </main>
    );
}

export default InventoryAddMedicine
