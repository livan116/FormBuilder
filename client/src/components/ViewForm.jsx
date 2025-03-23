import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getFormById, submit_Response } from "../api";
import { toast } from "react-toastify";

const ViewForm = () => {
  const { id } = useParams();
  const [form, setForm] = useState({});
  const [responses, setResponses] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForm = async () => {
      const data = await getFormById(id);
      setForm(data);
    };
    fetchForm();
  }, [id]);

  const validateInput = (input) => {
    const { type, value } = input;

    if (!value) return "This field is required.";

    switch (type) {
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Invalid email address.";
        break;
      case "number":
        if (isNaN(value)) return "Must be a number.";
        if (!/^\d{10}$/.test(value))
          return "Mobile number must be exactly 10 digits.";
        break;
      case "password":
        if (value.length < 8) return "Password must be at least 8 characters.";
        break;
      case "date":
        if (isNaN(Date.parse(value))) return "Invalid date.";
        break;
      default:
        if (value.length < 3) return "Input must be at least 3 characters.";
    }

    return null; // No error
  };

  const handleSubmit = async () => {
    const errors = {};

    form.inputs.forEach((input) => {
      const error = validateInput({
        type: input.type,
        value: responses[input._id],
      });
      if (error) {
        errors[input._id] = error;
      }
    });

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    } else {
      try {
        await submit_Response(form._id, responses);
        toast.success("Response submitted successfully!");
        navigate("/");
      } catch (error) {
        console.error("Failed to submit response:", error);
        toast.error("Failed to submit response. Please try again.");
      }
    }
  };

  return (
    <div className="p-8 flex flex-col justify-center items-center bg-gray-50 min-h-screen">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">{form.title}</h1>
        
        <div className="space-y-6">
          {form.inputs?.map((input, index) => (
            <div key={index} className="mb-4">
              <label className="block mb-2 font-medium text-gray-700">{input.title}</label>
              <input
                type={input.type}
                placeholder={input.placeholder}
                value={responses[input._id] || ""}
                onChange={(e) =>
                  setResponses({ ...responses, [input._id]: e.target.value })
                }
                className={`border ${errors[input._id] ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg w-full focus:outline-none focus:ring-2 ${errors[input._id] ? 'focus:ring-red-500' : 'focus:ring-blue-500'} transition-all`}
              />
              <div className="h-5 mt-1">
                {errors[input._id] && (
                  <p className="text-red-500 text-sm">{errors[input._id]}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg cursor-pointer transition-colors duration-300 font-semibold shadow-md"
          >
            Submit Response
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewForm;