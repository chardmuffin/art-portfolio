import React, { useState } from 'react';
import { Card, CardContent, CardHeader, TextField } from '@mui/material';

const CreateCategory = () => {
  const [category, setCategory] = useState('');

  const handleChange = (event) => {
    setCategory(event.target.value);
  };

  return (
    <Card sx={{ boxShadow: 8, borderRadius: '4px', mt: 2 }}>
      <CardHeader title="Add New Categories" sx={{ pb: 0 }} />
      <CardContent>
        <form noValidate autoComplete="off">
          <TextField
            id="category"
            label="New Category"
            value={category}
            onChange={handleChange}
            fullWidth
            maxLength={50}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateCategory;