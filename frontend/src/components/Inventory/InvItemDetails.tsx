import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { endpoints } from "../../config/config";
import Header from "../Header";

interface MedicineItem {
    name: string;
    category: string;
    description: string;
    sideEffects: string;
    price: number;
    quantity: number;
    expirationDate: string;
    expirationStatus: string;
    id: string;
}

const InvItemDetails = () => {
    const params = useParams<{ medicineId: string }>();
    const token = localStorage.getItem("token")
    const [itemData, setItemData] = useState<MedicineItem | null>(null);
    const navigate = useNavigate()
    const [isAdmin, setIsAdmin] = useState(false);
    
    useEffect(() => {
        const getItemDetails = async () => {
            try {
                const response = await fetch(endpoints.getMedId + params.medicineId, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })
    
                if (!response.ok) {
                    throw new Error('Failed to fetch medicines');
                  }
          
                const data: MedicineItem = await response.json();
                setItemData(data);
            } catch (error) {
                console.error("Error fetching medicine details: ", error)
            }
        }

        const checkIfAdmin = async () => {
            try {
                const response = await fetch(endpoints.getUserId, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })
    
                if (!response.ok) {
                    throw new Error('Failed to fetch medicines');
                }

                const data = await response.json();
                console.log(data)
          
                setIsAdmin(true);
            } catch (error) {
                console.error("Error fetching medicine details: ", error)
            }
        }

        getItemDetails()
        checkIfAdmin()
    }, [token, params.medicineId])

    const handleDelete = async () => {
        await fetch(endpoints.deleteMed + params.medicineId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        navigate("/inventory/item-list")
    }

    return (
        <main className="bg-primaryBG w-full h-full">
            <Header />

            <div className="w-full max-w-7xl mx-auto px-5 flex flex-col flex-1 mt-5">

                {/* Top Section */}
                <section className='w-full flex flex-row justify-between items-center mb-8'>
                    <div className="flex flex-col">
                        <div className="flex flex-row gap-2 items-center">
                            <Link className='text-darkGray text-2xl font-bold' to="/inventory">Inventory</Link>
                            <h1 className='text-darkGray text-xl font-bold'>{'>'}</h1>
                            <Link className='text-darkGray text-2xl font-bold' to="/inventory/item-list">List of Medicines</Link>
                            <h1 className='text-darkGray text-xl font-bold'>{'>'}</h1>
                            <h1 className='text-darkGreen text-2xl font-bold'>{itemData?.name} {`(${itemData?.quantity})`}</h1>
                        </div>
                        <h3 className="text-gray-500">Medicine details are listed here.</h3>
                    </div>
                </section>
                
                {/* Details Section */}
                <section className="flex flex-col gap-8">
                    {/* Stats Cards */}
                    <div className="flex flex-wrap gap-6">
                        {/* Medicine ID Card */}
                        <div className="flex-1 min-w-[200px] bg-white rounded-lg shadow p-6">
                            <h3 className="text-gray-500 text-sm font-medium">Medicine ID</h3>
                            <p className="text-3xl font-bold mt-2">{params.medicineId?.slice(0, 8)}</p>
                        </div>

                        {/* Medicine Group Card */}
                        <div className="flex-1 min-w-[200px] bg-white rounded-lg shadow p-6">
                            <h3 className="text-gray-500 text-sm font-medium">Medicine Group</h3>
                            <p className="text-3xl font-bold mt-2">{itemData?.category || 'N/A'}</p>
                        </div>

                        {/* Inventory Qty Card */}
                        <div className="flex-1 min-w-[200px] bg-white rounded-lg shadow p-6">
                            <h3 className="text-gray-500 text-sm font-medium">Inventory in Qty</h3>
                            <p className="text-3xl font-bold mt-2">{itemData?.quantity}</p>
                        </div>

                        {/* Stock Left Card */}
                        <div className="flex-1 min-w-[200px] bg-white rounded-lg shadow p-6">
                            <h3 className="text-gray-500 text-sm font-medium">Stock Left</h3>
                            <p className="text-3xl font-bold mt-2">{itemData?.quantity}</p>
                        </div>
                    </div>

                    {/* How to use Section */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">How to use</h2>
                        <p className="text-gray-700">
                            {itemData?.description || 'Take this medication by mouth with or without food as directed by your doctor, usually once daily.'}
                        </p>
                    </div>

                    {/* Side Effects Section */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">Side Effects</h2>
                        <p className="text-gray-700">
                            {itemData?.sideEffects || 'Dizziness, lightheadedness, drowsiness, nausea, vomiting, tiredness, excess saliva/drooling, blurred vision, weight gain, constipation, headache, and trouble sleeping may occur. If any of these effects persist or worsen, consult your doctor.'}
                        </p>
                    </div>

                    {/* Additional Info Section */}
                    <div className="flex flex-wrap gap-6 mb-8">
                        {/* Price Card */}
                        <div className="flex-1 min-w-[200px] bg-white rounded-lg shadow p-6">
                            <h3 className="text-gray-500 text-sm font-medium">Price</h3>
                            <p className="text-2xl font-bold mt-2">P {itemData?.price?.toFixed(2) || '0.00'}</p>
                        </div>

                        {/* Expiration Card */}
                        <div className="flex-1 min-w-[200px] bg-white rounded-lg shadow p-6">
                            <h3 className="text-gray-500 text-sm font-medium">Expiration Date</h3>
                            <p className="text-xl font-bold mt-2">
                                {itemData?.expirationDate ? new Date(itemData.expirationDate).toLocaleDateString() : 'N/A'}
                            </p>
                            <p className={`text-sm mt-1 ${
                                itemData?.expirationStatus === 'expired' ? 'text-red-500' : 'text-green-500'
                            }`}>
                                {itemData?.expirationStatus?.toUpperCase() || 'VALID'}
                            </p>
                        </div>
                    </div>
                </section>
                {
                    isAdmin ? (<button className="text-center font-bold bg-red-300 w-50 px-4 py-3 rounded-full border border-redBorder text-darkGray cursor-pointer hover:bg-red-500 hover:text-cleanWhite" onClick={handleDelete}>Delete Item</button>) : (<></>)
                }
            </div>
        </main>
    );
};

export default InvItemDetails;