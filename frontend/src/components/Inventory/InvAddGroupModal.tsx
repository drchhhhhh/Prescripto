import { X } from "lucide-react";
import { useState, FormEvent } from "react";
import { endpoints } from "../../config/config";
import { useNavigate } from "react-router";

interface AddGroupModalProps {
  onClose: () => void;
  isOpen: boolean;
  refreshGroups: () => void;
}

export default function AddGroupModal({ isOpen, onClose, refreshGroups }: AddGroupModalProps) {
  if (!isOpen) return null;
  
  const [form, setForm] = useState({
    name: "",
    description: "",
    emoji: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(endpoints.createGroup, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create group");
      }

      // Success - close modal and refresh or navigate
      refreshGroups();
      onClose();
      navigate("/inventory/groups", { state: { refresh: true } });
      
    } catch (error) {
      console.error("Failed to add group:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-darkGray/50 flex items-center justify-center p-4 z-50 font-poppins">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-darkGray">
            Add New Medicine Group
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-primaryGreen transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-5">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Group Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primaryGreen focus:border-primaryGreen"
                  placeholder="Enter group name"
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primaryGreen focus:border-primaryGreen"
                  placeholder="Enter description"
                  rows={3}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="emoji" className="block text-sm font-medium text-gray-700 mb-1">
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  id="emoji"
                  name="emoji"
                  value={form.emoji}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primaryGreen focus:border-primaryGreen"
                  placeholder="e.g., 💊"
                  onChange={handleChange}
                  maxLength={2}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end p-4 border-t border-gray-200 gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-darkGray hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-primaryGreen text-cleanWhite rounded-md hover:bg-darkGreen transition-colors flex items-center justify-center min-w-24"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "Create Group"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}