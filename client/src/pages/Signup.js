import React, { useState } from 'react';

const Signup = () => {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();

  };

  return (
    <main>
      Signup
    </main>
  );
};

export default Signup;
