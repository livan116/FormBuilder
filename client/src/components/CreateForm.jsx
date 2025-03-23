import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { create_Form, getFormById, update_Form } from "../api.js";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const CreateForm = () => {
  const [title, setTitle] = useState("");
  const [inputs, setInputs] = useState([]);
  const { id } = useParams(); // Get the form ID from the URL (if editing)
  const navigate = useNavigate();

  // Fetch form data if editing
  useEffect(() => {
    if (id) {
      const fetchForm = async () => {
        const form = await getFormById(id);
        setTitle(form.title);
        setInputs(form.inputs);
      };
      fetchForm();
    }
  }, [id]);

  const addInput = (type) => {
    const newInput = {
      id: `input-${inputs.length + 1}`,
      type,
      title: "",
      placeholder: "",
    };
    setInputs([...inputs, newInput]);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(inputs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setInputs(items);
  };

  // Save or update the form
  const handleSaveForm = async () => {
    try {
      const formData = {
        title,
        inputs: inputs.map((input) => ({
          type: input.type,
          title: input.title,
          placeholder: input.placeholder,
        })),
      };

      if (id) {
        // Update existing form
        await update_Form(id, formData);
      } else {
        // Create new form
        await create_Form(formData);
      }
      toast.success("Form saved successfully!");
      navigate("/"); // Redirect to the home page
    } catch (error) {
      console.log(error)
      toast.error(
        id
          ? "error occurred updating the form. Please try again."
          : "error occurred creating the form. Please try again."
      );
    }
  };

  return (
    <div className="flex flex-col justify-center items-center m-10 max-w-5xl mx-auto">
      <div className="flex flex-col justify-center items-center w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          {id ? "Update Form" : "Create New Form"}
        </h1>
        <input
          type="text"
          placeholder="Form Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg mb-6 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          required
        />
        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => addInput("text")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md"
          >
            Add Text Input
          </button>
          <button
            onClick={() => addInput("email")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md"
          >
            Add Email Input
          </button>
          <button
            onClick={() => addInput("number")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md"
          >
            Add Number Input
          </button>
          <button
            onClick={() => addInput("password")}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md"
          >
            Add Password Input
          </button>
          <button
            onClick={() => addInput("date")}
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md"
          >
            Add Date Input
          </button>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="inputs">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid md:grid-cols-2 gap-6 w-full"
              >
                {inputs.map((input, index) => (
                  <Draggable
                    key={input.id}
                    draggableId={input.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="border border-gray-200 p-5 rounded-lg shadow-md bg-gray-50 hover:shadow-lg transition-all"
                      >
                        <div className="text-sm text-gray-500 mb-2">
                          {input.type.charAt(0).toUpperCase() + input.type.slice(1)} Input
                        </div>
                        <input
                          type="text"
                          placeholder="Input Title"
                          value={input.title}
                          onChange={(e) => {
                            const newInputs = [...inputs];
                            newInputs[index].title = e.target.value;
                            setInputs(newInputs);
                          }}
                          className="border border-gray-300 p-2 rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Placeholder"
                          value={input.placeholder}
                          onChange={(e) => {
                            const newInputs = [...inputs];
                            newInputs[index].placeholder = e.target.value;
                            setInputs(newInputs);
                          }}
                          className="border border-gray-300 p-2 rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => {
                            const newInputs = inputs.filter(
                              (_, i) => i !== index
                            );
                            setInputs(newInputs);
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 w-full"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <button
          type="submit"
          onClick={handleSaveForm}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg mt-8 cursor-pointer transition-colors duration-300 font-semibold shadow-md"
        >
          {id ? "Update Form" : "Save Form"}
        </button>
      </div>
    </div>
  );
};

export default CreateForm;