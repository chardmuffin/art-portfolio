import React, { useState } from 'react';
import { Card, Button, CardContent, CardHeader, TextField } from '@mui/material';
import axios from '../../../utils/axiosConfig';
import { useMutation } from 'react-query';

const CreateCategory = () => {
  const [category, setCategory] = useState('');

  const handleChange = (event) => {
    setCategory(event.target.value);
  };

  const createCategoryMutation = useMutation(
    async () => {
      const existingCategories = await axios.get('/api/categories');
      const duplicateCategory = existingCategories.data.find(
        (existingCategory) => existingCategory.name.toLowerCase() === category.toLowerCase()
      );

      if (duplicateCategory) {
        throw new Error('This category already exists.');
      } else {
        await axios.post('/api/categories', { name: category }, { withCredentials: true });
      }
    },
    {
      onSuccess: () => {
        setCategory('');
        alert('Category created successfully!');
      },
      onError: (error) => {
        alert('There was an error creating the category:\n\n' + error.message);
      },
    }
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    createCategoryMutation.mutate();
  };

  return (
    <Card sx={{ boxShadow: 8, borderRadius: '4px', mt: 2 }}>
      <CardHeader title="Create New Category" sx={{ pb: 0 }} />
      <CardContent>
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <TextField
            id="category"
            label="New Category"
            value={category}
            onChange={handleChange}
            fullWidth
            maxLength={50}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
            disabled={createCategoryMutation.isLoading}
          >
            Save
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateCategory;