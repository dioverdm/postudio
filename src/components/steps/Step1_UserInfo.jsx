import React from 'react';

const Step1 = ({ nextStep, handleChange, values, errors }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Enter Your Information</h2>

      <div>
        <label className="block mb-1 font-medium">Name</label>
        <input
          type="text"
          value={values.name}
          onChange={handleChange('name')}
          placeholder="Name"
          className={`w-full px-4 py-2 rounded-lg bg-white border ${
            errors?.name ? 'border-red-500' : 'border-gray-300'
          } shadow-sm focus:outline-none focus:ring-2 ${
            errors?.name ? 'focus:ring-red-500' : 'focus:ring-blue-500'
          } transition`}
        />
        {errors?.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          value={values.email}
          onChange={handleChange('email')}
          placeholder="you@example.com"
          className={`w-full px-4 py-2 rounded-lg bg-white border ${
            errors?.email ? 'border-red-500' : 'border-gray-300'
          } shadow-sm focus:outline-none focus:ring-2 ${
            errors?.email ? 'focus:ring-red-500' : 'focus:ring-blue-500'
          } transition`}
        />
        {errors?.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Phone Number</label>
        <input
            type="tel"
            placeholder="Phone Number"
            value={values.phone}
            onChange={handleChange('phone')}
            className={`w-full px-4 py-2 mt-2 text-sm rounded-lg bg-white border shadow-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-all duration-300
                ${errors?.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'}
            `}
            />
            {errors?.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}

      </div>

      <div className="flex justify-end mt-6">
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

export default Step1;
