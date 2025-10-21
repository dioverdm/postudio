import React from 'react';

const Step3 = ({ values, handleSubmit, prevStep }) => (
  <div className="space-y-6 bg-white p-6 rounded-xl shadow-lg max-w-lg mx-auto">
    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Confirm Your Details</h3>

    <div className="space-y-3 text-gray-700">
      <div className="p-4 rounded-lg shadow-md bg-gray-50">
        <strong>Name:</strong> {values.name}
      </div>
      <div className="p-4 rounded-lg shadow-md bg-gray-50">
        <strong>Email:</strong> {values.email}
      </div>
      <div className="p-4 rounded-lg shadow-md bg-gray-50">
        <strong>Phone:</strong> {values.phone}
      </div>
      <div className="p-4 rounded-lg shadow-md bg-gray-50">
        <strong>Room Types:</strong> {values.roomType.length ? values.roomType.join(', ') : 'None'}
      </div>
      <div className="p-4 rounded-lg shadow-md bg-gray-50">
        <strong>Budget:</strong> {values.budget}
      </div>
    </div>

    <div className="flex justify-between mt-6">
      <button
        onClick={prevStep}
        className="bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded-lg transition"
      >
        Back
      </button>
      <button
        onClick={handleSubmit}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
      >
        Submit
      </button>
    </div>
  </div>
);

export default Step3;
