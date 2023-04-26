import React, { useState } from 'react';
import { Card, CardContent, CardHeader, TextField, Button, InputLabel, Input, FormControl, Select, MenuItem } from '@mui/material';
import axios from '../../../utils/axiosConfig';
import { useMutation, useQuery } from 'react-query';

const CreateProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: ''
  });
  const [image, setImage] = useState(null);

  const { data: categories, isLoading: categoriesLoading } = useQuery('categories', () =>
    axios.get('/api/categories').then((res) => res.data)
  );

  const createProductMutation = useMutation(
    async () => {
      const { data: newProduct } = await axios.post('/api/products', product, { withCredentials: true });

      const data = new FormData();
      data.append('image', image)
      data.append('product_id', newProduct.id)
      await axios.post('/api/products/images', data, { withCredentials: true, headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      } });
    },
    {
      onSuccess: () => {
        setProduct({ name: '', description: '', price: '', stock: '', category_id: '' });
        setImage(null);
        alert('Product created successfully!');
      },
      onError: (error) => {
        alert('There was an error creating the product:\n\n' + error.message);
      },
    }
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('image', image);
    formData.append('product_id', product.id);
    createProductMutation.mutate(formData);
  };

  const handleInputChange = async (event) => {
    const { name, value } = event.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  return (
    <Card sx={{ boxShadow: 8, borderRadius: '4px', mt: 2 }}>
      <CardHeader title="Create Product" sx={{ pb: 0 }} />
      <CardContent>
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="name"
            label="Product Name"
            value={product.name}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            name="description"
            label="Description"
            value={product.description}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            name="price"
            label="Price"
            value={product.price}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            name="stock"
            label="Stock"
            value={product.stock}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel htmlFor="category_id">Category</InputLabel>
            <Select
              label="Category"
              name="category_id"
              id="category_id"
              value={product.category_id}
              onChange={handleInputChange}
            >
              {categoriesLoading ? (
                <MenuItem value="">
                  <em>Loading...</em>
                </MenuItem>
              ) : (
                categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
          <InputLabel htmlFor="image">Product Image</InputLabel>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={createProductMutation.isLoading}>
            Save
          </Button>
        </form>
      </CardContent>
    </Card>
  );  
};

export default CreateProduct;