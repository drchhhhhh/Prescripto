import { X } from "lucide-react";
import { endpoints } from "../../config/config";
import { useNavigate } from "react-router";

interface DelGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  refreshGroups: () => void;
  groupName: string;
  groupId: string;
}

export default function DelGroupModal({
  isOpen,
  onClose,
  refreshGroups,
  groupId,
  groupName,
}: DelGroupModalProps) {
  if (!isOpen) return null;

  const token = localStorage.getItem("token")
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await fetch(endpoints.deleteGroup.replace(':id', groupId), {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error(`Error: ${response}`);
      }

      onClose();
      refreshGroups();
      navigate("/inventory/groups", { state: { refresh: true } });
    } catch (error) {
      console.error("Failed to delete group:", error);
    }
  }

  return (
    <div className="fixed inset-0 bg-darkGray/50 flex items-center justify-center p-4 z-50 font-poppins">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-darkGray">Delete Group</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-primaryGreen transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5">
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete the{" "}
            <span className="font-semibold">{groupName}</span> group? This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end p-4 border-t border-gray-200 gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-darkGray hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
