import React from "react";

const PopupModal = ({ message, type, button1, button2, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-50 flex">
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg">
        <div className="flex justify-between">
          <h2 className={`text-2xl font-semibold ${type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
            {type === 'success' ? 'Success' : 'Failed'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-gray-600 my-4">{message}</p>
        {button1 && (
          <button onClick={button1.onClick} className="bg-gold text-white py-2 px-4 rounded hover:bg-mutedGold mr-4">
            {button1.label}
          </button>
        )}
        {button2 && (
          <button onClick={button2.onClick} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
            {button2.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default PopupModal;
