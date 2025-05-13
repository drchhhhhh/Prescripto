import { Link, useNavigate, useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { endpoints } from '../../config/config';
import Header from '../../components/Header';

const InventoryEditMedicine = () => {
    const params = useParams<{ medicineId: string }>();
    const [form, setForm] = useState({
        name: "",
        category: "",
        price: "",
        quantity: "",
        expirationDate: "",
        description: "",
        sideEffects: "",
    })
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await fetch(endpoints.getAllGroups, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await res.json();
                setGroups(data);
            } catch (err) {
                console.error('Failed to fetch groups', err);
            }
        };

        fetchGroups();
    }, []);

    useEffect(() => {
        const fetchMedicine = async () => {
            try {
                const res = await fetch(`${endpoints.getMedId}/${params.medicineId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!res.ok) throw new Error("Failed to fetch medicine");

                const data = await res.json();

                setForm({
                    name: data.name || "",
                    category: data.category || "",
                    price: data.price?.toString() || "",
                    quantity: data.quantity?.toString() || "",
                    expirationDate: data.expirationDate?.split('T')[0] || "",
                    description: data.description || "",
                    sideEffects: data.sideEffects || "",
                });

            } catch (err) {
                console.error("Error fetching medicine:", err);
            }
        };

        if (params.medicineId) {
            fetchMedicine();
        }
    }, [token, params.medicineId]);

    const handleChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> ) => {
        setForm({
          ...form,
          [e.target.name]: e.target.value,
        });
      };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const selectedGroup = groups.find(group => group.name === form.category);
            const formData = {
                ...form,
                category: form.category || "None",
                group: selectedGroup ? selectedGroup.id : null
            };

            const response = await fetch(endpoints.updateMed + params.medicineId, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error(`Error: ${response.status}`);

            const data = await response.json();
            navigate("/inventory/item-list");
            return data;

        } catch (error) {
            console.error("Failed to edit item:", error);
        }
    };

    return (
        <main className="bg-primaryBG w-full h-full pl-64">
            <Header />

            <div className="w-full max-w-7xl mx-auto px-5 flex flex-col flex-1 mt-5">

                {/* Top Section */}
                <section className='w-full flex flex-row justify-between items-center'>
                    <div className="flex flex-col">
                        <div className="flex flex-row gap-2 items-center">
                            <Link className='text-darkGray text-2xl font-bold' to="/inventory">Inventory</Link>
                            <h1 className='text-darkGray text-xl font-bold'>{'>'}</h1>
                            <Link className='text-darkGray text-2xl font-bold' to="/inventory/item-list">List of Medicines</Link>
                            <h1 className='text-darkGray text-xl font-bold'>{'>'}</h1>
                            <h1 className='text-darkGreen text-2xl font-bold'>Edit Medicine</h1>
                        </div>
                        <h3>*All fields are mandatory and need to be filled.</h3>
                    </div>
                </section>
                
                <form className="flex flex-col w-full gap-4 mt-4" onSubmit={handleSubmit}>
                    <div className="flex flex-wrap gap-4">
                        {/* Medicine Name */}
                        <div className="flex flex-col flex-1 min-w-[200px]">
                            <label className="text-sm font-medium text-gray-700 mb-1">
                                Medicine Name*
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="px-3 py-2 border border-gray-300 rounded-md bg-inputBG focus:outline-none focus:ring-2 focus:ring-primaryGreen"
                            />
                        </div>

                        {/* Medicine ID */}
                        <div className="flex flex-col flex-1 min-w-[200px]">
                            <label className="text-sm font-medium text-gray-700 mb-1">
                                Medicine Price*
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                className="px-3 py-2 border border-gray-300 rounded-md bg-inputBG focus:outline-none focus:ring-2 focus:ring-primaryGreen"
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {/* Medicine Group (Dropdown) */}
                        <div className="flex flex-col flex-1 min-w-[200px]">
                            <label className="text-sm font-medium text-gray-700 mb-1">
                                Medicine Group*
                            </label>
                            <select
                                name="category"
                                onChange={handleChange}
                                className="px-3 py-2 border border-gray-300 rounded-md bg-inputBG focus:outline-none focus:ring-2 focus:ring-primaryGreen"
                            >
                                <option value="">- Select Group -</option>
                                {groups.map((group) => (
                                    <option key={group.id} value={group.name}>
                                        {group.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Quantity */}
                        <div className="flex flex-col flex-1 min-w-[200px]">
                            <label className="text-sm font-medium text-gray-700 mb-1">
                                Quantity in Number*
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                value={form.quantity}
                                onChange={handleChange}
                                className="px-3 py-2 border border-gray-300 rounded-md bg-inputBG focus:outline-none focus:ring-2 focus:ring-primaryGreen"
                            />
                        </div>
                    </div>

                    {/* Expiration Date */}
                    <div className="flex flex-wrap gap-4">
                        <div className="flex flex-col flex-1 min-w-[200px]">
                            <label className="text-sm font-medium text-gray-700 mb-1">
                                Expiration Date*
                            </label>
                            <input
                                type="date"
                                name="expirationDate"
                                value={form.expirationDate}
                                onChange={handleChange}
                                className="px-3 py-2 border border-gray-300 rounded-md bg-inputBG focus:outline-none focus:ring-2 focus:ring-primaryGreen"
                                required
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">

                        {/* How to Use */}
                        <div className="flex flex-col flex-1 min-w-[200px]">
                            <label className="text-sm font-medium text-gray-700 mb-1">
                                How to Use*
                            </label>
                            <input
                                type="text"
                                name="description"
                                value={form.description}
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
                                value={form.sideEffects}
                                onChange={handleChange}
                                className="px-3 py-2 border border-gray-300 rounded-md bg-inputBG focus:outline-none focus:ring-2 focus:ring-primaryGreen h-38"
                            />
                        </div>
                    </div>
                    <button type="submit" className='bg-primaryGreen rounded-md p-2 text-cleanWhite cursor-pointer hover:bg-darkGreen ease-in duration-100'>Edit Item</button>
                </form>
            </div>
        </main>
    );
}

export default InventoryEditMedicine
