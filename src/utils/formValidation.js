// Form validation utilities

export const validators = {
  required: (value) => value?.toString().trim() !== '' || 'This field is required',
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Invalid email address',
  phone: (value) => /^[0-9]{10}$/.test(value) || 'Phone must be 10 digits',
  minLength: (min) => (value) => value?.length >= min || `Minimum ${min} characters required`,
  maxLength: (max) => (value) => value?.length <= max || `Maximum ${max} characters allowed`,
  number: (value) => !isNaN(value) || 'Must be a number',
  positive: (value) => Number(value) > 0 || 'Must be positive',
  dateAfter: (startDate) => (endDate) => 
    new Date(endDate) > new Date(startDate) || 'End date must be after start date',
  notPastDate: (value) => 
    new Date(value) >= new Date().setHours(0,0,0,0) || 'Cannot select past dates',
};

export const validateForm = (formData, rules) => {
  const errors = {};
  
  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = formData[field];
    
    for (const rule of fieldRules) {
      const result = rule(value);
      if (result !== true) {
        errors[field] = result;
        break;
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const useFormValidation = (initialValues, rules) => {
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});

  const handleChange = (field, value) => {
    setValues(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const fieldRules = rules[field] || [];
      for (const rule of fieldRules) {
        const result = rule(value);
        if (result !== true) {
          setErrors(prev => ({ ...prev, [field]: result }));
          return;
        }
      }
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const fieldRules = rules[field] || [];
    const value = values[field];
    for (const rule of fieldRules) {
      const result = rule(value);
      if (result !== true) {
        setErrors(prev => ({ ...prev, [field]: result }));
        return;
      }
    }
  };

  const handleSubmit = (onSubmit) => (e) => {
    e.preventDefault();
    const validation = validateForm(values, rules);
    if (validation.isValid) {
      onSubmit(values);
    } else {
      setErrors(validation.errors);
      setTouched(Object.keys(rules).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    }
  };

  return { values, errors, touched, handleChange, handleBlur, handleSubmit };
};
