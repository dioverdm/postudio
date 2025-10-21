import React from 'react';
import { FaBed, FaBath, FaCouch, FaUtensils, FaLaptopHouse } from 'react-icons/fa';

const roomOptions = [
  { label: 'Bedroom', value: 'bedroom', icon: <FaBed className="text-3xl text-blue-600" /> },
  { label: 'Bathroom', value: 'bathroom', icon: <FaBath className="text-3xl text-blue-600" /> },
  { label: 'Living Room', value: 'livingroom', icon: <FaCouch className="text-3xl text-blue-600" /> },
  { label: 'Kitchen', value: 'kitchen', icon: <FaUtensils className="text-3xl text-blue-600" /> },
  { label: 'Workstation', value: 'workstation', icon: <FaLaptopHouse className="text-3xl text-blue-600" /> },
];

const Step2 = ({ nextStep, prevStep, handleChange, values, errors }) => {
  const toggleRoomSelection = (value) => {
    const current = values.roomType || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    handleChange('roomType')({ target: { value: updated } });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mt-5">Select Room Types & Budget</h2>

      {/* Room Type Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {roomOptions.map((room) => {
          const isSelected = (values.roomType || []).includes(room.value);

          return (
            <div
              key={room.value}
              onClick={() => toggleRoomSelection(room.value)}
              className={`border rounded-xl p-4 cursor-pointer shadow-sm transition-all flex items-center gap-4
                ${isSelected ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-gray-200 bg-white hover:shadow-md'}
              `}
            >
              {room.icon}
              <div className="flex-1">
                <p className="font-medium text-gray-700">{room.label}</p>
              </div>

              {/* Custom Checkbox */}
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                transition-all duration-300
                ${isSelected ? 'border-blue-600 shadow-md' : 'border-gray-400'}
                bg-white`}
              >
                {isSelected && <div className="w-3 h-3 bg-blue-600 rounded-full shadow-sm" />}
              </div>
            </div>
          );
        })}
      </div>
      {/* Error for roomType */}
      {errors?.roomType && (
        <p className="text-red-500 text-sm mt-1">{errors.roomType}</p>
      )}

      {/* Budget Input */}
      <div>
        <input
          type="text"
          placeholder="Estimated Budget (e.g. ₱5000)"
          value={values.budget}
          onChange={handleChange('budget')}
          className={`w-full mt-4 px-4 py-2 text-sm rounded-lg bg-white border shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all duration-300
            ${errors?.budget ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'}
          `}
        />
        {errors?.budget && (
          <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={prevStep}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Back
        </button>
        <button
          onClick={nextStep}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step2;
