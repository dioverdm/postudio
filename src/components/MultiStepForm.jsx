import React, { useState } from 'react';
import Step1 from './steps/Step1_UserInfo';
import Step2 from './steps/Step2_ProjectDetails';
import Step3 from './steps/Step3_Confirmation';
import { supabase } from '../utils/supabaseClient';

const stepsList = ['User Info', 'Project Details', 'Confirmation'];

const MultiStepForm = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    roomType: [],
    budget: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (input) => (e) => {
    setFormData({ ...formData, [input]: e.target.value });
    };

  const validateStep = () => {
  let tempErrors = {};

  if (step === 1) {
    if (!formData.name.trim()) tempErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = 'Enter a valid email address';
    }

    if (!formData.phone.trim()) {
      tempErrors.phone = 'Phone number is required';
    } else if (!/^\d{7,15}$/.test(formData.phone)) {
      tempErrors.phone = 'Enter a valid phone number (only digits)';
    }

  } else if (step === 2) {
    if (!formData.roomType.length) tempErrors.roomType = 'Select at least one room type';
    if (!formData.budget.trim()) {
      tempErrors.budget = 'Budget is required';
    } else if (!/^\d+$/.test(formData.budget)) {
      tempErrors.budget = 'Enter a valid budget (digits only)';
    }
  }

  setErrors(tempErrors);
  return Object.keys(tempErrors).length === 0;
};

  const nextStep = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
  if (!formData.name || !formData.email || !formData.roomType.length || !formData.budget) {
    alert('Please complete the form before submitting.');
    return;
  }
  const { roomType, ...rest } = formData;
  const { data, error } = await supabase.from('quotes').insert([
    {
      ...rest,
      room_type: roomType,
    },
  ]);
  if (error) {
    alert('Something went wrong! Please Try again.');
  } else {
    alert('Quote submitted!');
    onClose();
  }
};


  const steps = {
    1: <Step1 nextStep={nextStep} handleChange={handleChange} values={formData} errors={errors} />,
    2: <Step2 nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} values={formData} errors={errors} />,
    3: <Step3 prevStep={prevStep} values={formData} handleSubmit={handleSubmit} />,
  };

  return (
    <div className="w-full mb-8">
      {/* Progress Bar */}
      <div className="max-w-xl mx-auto">
        <div className="grid grid-cols-5 items-center gap-2 sm:gap-4">
          {stepsList.map((label, index) => {
            const stepNum = index + 1;
            const isCompleted = step > stepNum;
            const isActive = step === stepNum;

            return (
              <React.Fragment key={index}>
                <div className="col-span-1 flex flex-col items-center text-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                      ${isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}
                    `}
                  >
                    {stepNum}
                  </div>
                  <span
                    className={`mt-2 text-xs sm:text-sm
                      ${isActive ? 'text-blue-600 font-medium' : 'text-gray-500'}
                    `}
                  >
                    {label}
                  </span>
                </div>

                {index < stepsList.length - 1 && (
                  <div className="col-span-1 sm:col-span-1 h-1 bg-gray-300 relative">
                    <div
                      className={`absolute top-0 left-0 h-full transition-all duration-300
                        ${step > stepNum ? 'w-full bg-green-500' : step === stepNum ? 'w-1/2 bg-blue-600' : 'w-0'}
                      `}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="w-full mt-8 max-w-xl mx-auto">
        {steps[step]}
      </div>
    </div>
  );
};

export default MultiStepForm;
