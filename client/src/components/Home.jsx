import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { delete_Form, get_Forms } from "../api";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from "react-toastify";

const Home = () => {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForms = async () => {
      const data = await get_Forms();
      setForms(data);
    };
    fetchForms();
  }, []);

  // Handle form deletion
  const handleDeleteForm = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this form?")) {
        await delete_Form(id);
        setForms(forms.filter((form) => form._id !== id)); // Remove the deleted form from the list
        toast.success("Form deleted successfully!");
      }
    } catch (error) {
      console.log(error)
      toast.error("Error deleting form. Please try again.");
    }
  };

  return (
    <div className="p-8 flex flex-col justify-center items-center bg-gray-50 min-h-screen">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">My Forms</h1>
        <div className="flex justify-center mb-6">
          <Link
            to="/form/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-block transition-colors duration-300 font-semibold shadow-md"
          >
            Create New Form
          </Link>
        </div>
        <div className="w-full space-y-4">
          {forms.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl">You have no forms created yet.</p>
              <p className="mt-2">Click the button above to create your first form!</p>
            </div>
          ) : (
            forms.map((form) => (
              <div
                key={form._id}
                className="border border-gray-200 p-5 rounded-lg shadow-sm hover:shadow-md transition-all flex justify-between items-center bg-white"
              >
                <Link 
                  to={`/form/${form._id}`} 
                  className="text-blue-600 hover:text-blue-800 text-lg font-medium transition-colors"
                >
                  {form.title}
                </Link>
                <div className="flex gap-3">
                  <button 
                    onClick={() => navigate(`/form/${form._id}/edit`)}
                    className="text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50"
                  >
                    <CiEdit className="text-2xl" />
                  </button>
                  <button 
                    onClick={() => handleDeleteForm(form._id)}
                    className="text-gray-600 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                  >
                    <MdDeleteOutline className="text-2xl" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;