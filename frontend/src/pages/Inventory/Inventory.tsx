import { AiOutlineMedicineBox } from "react-icons/ai";
import { MdOutlineWarningAmber } from "react-icons/md";
import { Link } from 'react-router';

const InventoryPage = () => {
  return (
    <main className="bg-primaryBG w-full min-h-screen p-5">
        <section className='w-full flex flex-row justify-between items-center'>
            <div className="flex flex-col">
                <h1 className='text-darkGray text-2xl font-bold'>Inventory</h1>
                <h3>List of medicines available for sale.</h3>
            </div>
            {/* Add a popup form for Group Creation */}
            <button className='bg-primaryGreen rounded-md p-2 text-cleanWhite cursor-pointer hover:bg-darkGreen ease-in duration-100'>+ Add New Item</button>
        </section>

        <section className="flex flex-row gap-5 mt-15">
            <div className="flex flex-col bg-cleanWhite w-72 h-48 shadow rounded-sm border-blueBorder border-2 items-center justify-between">
                <AiOutlineMedicineBox className='text-blueBorder text-6xl mt-2'/>
                {/* ADD A COUNTER HERE HOW MANY MEDICINES ARE AVAILABLE */}
                <h1 className="text-xl">Medicines Available</h1>
                <Link to="/inventory/item-list" className="bg-lightBlue text-center w-full p-1 border-t-2 border-blueBorder rounded-b-sm cursor-pointer hover:bg-lightBlue-dark ease-in duration-100">
                    View Full List »
                </Link>
            </div>

            <div className="flex flex-col bg-cleanWhite w-72 h-48 shadow rounded-sm border-greenBorder border-2 items-center justify-between">
                <AiOutlineMedicineBox className='text-greenBorder text-6xl mt-2'/>
                {/* ADD A COUNTER HERE HOW MANY GROUPS */}
                <h1 className="text-xl">Medicine Groups</h1>
                <Link to="/inventory/item-groups" className="bg-mintGreen text-center w-full p-1 border-t-2 border-greenBorder rounded-b-sm cursor-pointer hover:bg-mintGreen-dark ease-in duration-100">
                    View Groups »
                </Link>
            </div>

            <div className="flex flex-col bg-cleanWhite w-72 h-48 shadow rounded-sm border-redBorder border-2 items-center justify-between">
                <MdOutlineWarningAmber className='text-redBorder text-6xl mt-2'/>
                {/* ADD COUNTER MEDICINE SHORTAGE */}
                <h1 className="text-xl">Medicine Shortage</h1>
                <Link to="/inventory/" className="bg-peach text-center w-full p-1 border-t-2 border-redBorder rounded-b-sm cursor-pointer hover:bg-peach-dark ease-in duration-100">
                    Resolve Now »
                </Link>
            </div>
        </section>
    </main>
  )
}

export default InventoryPage