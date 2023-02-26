import React, { useState } from 'react';
import ProductList from '../components/ProductList';
import axios from 'axios';
import { useQuery } from 'react-query';
import {
  InputLabel,
  TextField,
  Checkbox,
  FormGroup,
  FormControl,
  FormControlLabel,
  Slider,
  Select,
  InputAdornment,
  MenuItem
} from '@mui/material';

const Search = () => {
  const { isLoading, isError, data, error } = useQuery('products', () =>
    axios('http://localhost:3001/api/products', {
      responseType: 'json',
    }).then((response) => response.data)
  );

  const [filters, setFilters] = useState({
    text: '',
    inStockOnly: false,
    category: '',
    priceRange: [0, 500],
  });

  const handleFilterChange = (filterName, filterValue) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: filterValue,
    }));
  };

  const filteredProducts = data ? data.filter((product) => {
    if (filters.inStockOnly && product.stock <= 0) {
      return false;
    }
    if (filters.priceRange && (product.price < filters.priceRange[0] || product.price > filters.priceRange[1])) {
      return false;
    }
    if ((filters.category !== 'All' && filters.category !== '') && product.category.name !== filters.category) {
      return false;
    }
    if (
      filters.text &&
      !product.name.toLowerCase().includes(filters.text.toLowerCase())
    ) {
      return false;
    }
    return true;
  }) : [];

  const categories = ['All', ...new Set(data?.map((product) => product.category.name))];

  return (
    <main>
      <FormControl fullWidth>
        <TextField
          value={filters.text}
          label="Search"
          variant="outlined"
          onChange={(e) => handleFilterChange('text', e.target.value)}
          InputProps={{
            endAdornment: <InputAdornment position="end">🔍</InputAdornment>,
          }}
        />
      </FormControl>
      <FormGroup>
        <FormControl variant="outlined">
        <InputLabel id="category-label">Category</InputLabel>
          <Select
            label="Category"
            value={filters.category}
            autoWidth
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            {categories?.map((category) => (
              <MenuItem key={category} value={category}>
                {category==="All" ? <em>All</em> : category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControlLabel
          label="Only show products in stock"
          control={
            <Checkbox
              defaultChecked
              onChange={(e) => handleFilterChange('inStockOnly', e.target.checked)}
            />
          }
        />
        <InputLabel>Price Range</InputLabel>
        <Slider
          value={filters.priceRange}
          onChange={(e, newValue) => {
            handleFilterChange('priceRange', newValue);
          }}
          valueLabelDisplay="auto"
          min={0}
          max={500}
          step={10}
        />
      </FormGroup>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error: {error?.message ?? 'Unknown error'}</div>}
      {data && <ProductList products={filteredProducts} title="Results" />}
    </main>
  );
};

export default Search;
