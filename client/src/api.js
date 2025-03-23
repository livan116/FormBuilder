import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URI;

export const get_Forms = async () => {
  const response = await axios.get(`${apiUrl}/api/forms`);
  return response.data;
};

export const create_Form = async (form) => {
  const response = await axios.post(`${apiUrl}/api/forms`, form);

  return response.data;
};

export const update_Form = async (id, form) => {
  const response = await axios.put(`${apiUrl}/api/forms/${id}`, form);
  return response.data;
};

export const delete_Form = async (id) => {
  const response = await axios.delete(`${apiUrl}/api/forms/${id}`);
  return response.data;
};

export const getFormById = async (id) => {
  const response = await axios.get(`${apiUrl}/api/forms/${id}`);
  return response.data;
};

export const submit_Response = async (formId, responses) => {
  try {
    const response = await axios.post(`${apiUrl}/api/responses`, {
      formId,
      responses: Object.keys(responses).map((inputId) => ({
        inputId,
        value: responses[inputId],
      })),
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting responses:", error);
    throw error;
  }
};
