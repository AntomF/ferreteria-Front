import { useState } from "react";


export const useForm = (inicialForm, validateForm, closeModalAgregar) => {
    const [form, setForm] = useState(inicialForm);
    const [errors, setErrors] = useState({});
    //const [loading, setLoading] = useState(false);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
  
      setForm({
        ...form,
        [name]: value,
      });
    };
    const handleBlur = (e) => {
      handleChange(e);
      setErrors(validateForm(form));
    };
  
    return {
      form,
      setForm,
      setErrors,
      errors,
      handleChange,
      handleBlur,
    };
  };
  