import { AiOutlineMedicineBox } from "react-icons/ai";
import { MdOutlineWarningAmber } from "react-icons/md";
import { Link } from "react-router";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { endpoints } from "../../config/config";

const InventoryPage = () => {
  const token = localStorage.getItem("token");
  const [invStat, setInvStat] = useState<string | null>(null);
  const [groupStat, setGroupStat] = useState<string | null>(null);
  const [short, setShort] = useState<string | null>(null);

  useEffect(() => {
    const getAllMedCount = async () => {
      try {
        const res = await fetch(endpoints.dashInvStat, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Error loading inv status");
        }

        const data = await res.json();
        setInvStat(data.status);
      } catch (error) {
        console.log("Error status: ", error);
      }
    };

    const getAllGroups = async () => {
      try {
        const res = await fetch(endpoints.dashGroups, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Error loading group status");
        }

        const data = await res.json();
        setGroupStat(data.count);
      } catch (error) {
        console.log("Error status: ", error);
      }
    };

    const getShort = async () => {
      try {
        const res = await fetch(endpoints.dashMedShort, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Error loading group status");
        }

        const data = await res.json();
        setShort(data.count);
      } catch (error) {
        console.log("Error status: ", error);
      }
    };

    getAllMedCount();
    getAllGroups();
    getShort();
  }, [token]);

  return (
    <main className="bg-primaryBG w-full min-h-screen pl-64 font-poppins">
      <Header />
      <section className="w-full flex flex-row justify-between items-center p-5">
        <div className="flex flex-col">
          <h1 className="text-darkGray text-2xl font-bold">Inventory</h1>
          <h3>List of medicines available for sale.</h3>
        </div>
        <Link
          className="bg-primaryGreen rounded-md p-2 text-cleanWhite cursor-pointer hover:bg-darkGreen ease-in duration-100"
          to="/inventory/item-list/add"
        >
          + Add New Item
        </Link>
      </section>

      <section className="flex flex-row gap-5 mt-15 p-5 justify-center">
        <div className="flex flex-col bg-cleanWhite w-full h-48 shadow rounded-sm border-blueBorder border-2 items-center justify-between">
          <AiOutlineMedicineBox className="text-blueBorder text-6xl mt-2" />
          <h1 className="text-xl">{invStat ?? "Loading..."}</h1>
          <h1 className="text-xl">Medicines Available</h1>
          <Link
            to="/inventory/item-list"
            className="bg-lightBlue text-center w-full p-1 border-t-2 border-blueBorder rounded-b-sm cursor-pointer hover:bg-lightBlue-dark ease-in duration-100"
          >
            View Full List »
          </Link>
        </div>

        <div className="flex flex-col bg-cleanWhite w-full h-48 shadow rounded-sm border-greenBorder border-2 items-center justify-between">
          <AiOutlineMedicineBox className="text-greenBorder text-6xl mt-2" />
          <h1 className="text-xl">{groupStat ?? "Loading..."}</h1>
          <h1 className="text-xl">Medicine Groups</h1>
          <Link
            to="/inventory/groups"
            className="bg-mintGreen text-center w-full p-1 border-t-2 border-greenBorder rounded-b-sm cursor-pointer hover:bg-mintGreen-dark ease-in duration-100"
          >
            View Groups »
          </Link>
        </div>

        <div className="flex flex-col bg-cleanWhite w-full h-48 shadow rounded-sm border-redBorder border-2 items-center justify-between">
          <MdOutlineWarningAmber className="text-redBorder text-6xl mt-2" />
          <h1 className="text-xl">{short ?? "Loading..."}</h1>
          <h1 className="text-xl">Medicine Shortage</h1>
          <div
            className="bg-peach text-center w-full h-8 p-1 border-t-2 border-redBorder rounded-b-sm"
          >
            
          </div>
        </div>
      </section>
    </main>
  );
};

export default InventoryPage;
