import { X } from "lucide-react";

interface AddGroupModalProps {
  onClose: () => void;
  isOpen: boolean;
}

export default function AddGroupModal({ isOpen, onClose }: AddGroupModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-darkGray bg-opacity-50 flex items-center justify-center p-4 z-50 font-poppins">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-darkGray">Add New Medicine Group</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-primaryGreen transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primaryGreen focus:border-primaryGreen"
                placeholder="Enter group name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primaryGreen focus:border-primaryGreen"
                placeholder="Enter description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primaryGreen focus:border-primaryGreen"
                  placeholder="Emoji icon"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <select className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primaryGreen focus:border-primaryGreen">
                  <option>Green</option>
                  <option>Blue</option>
                  <option>Yellow</option>
                  <option>Red</option>
                  <option>Purple</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end p-4 border-t border-gray-200 gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-darkGray hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-primaryGreen text-cleanWhite rounded-md hover:bg-darkGreen transition-colors">
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
}
