import React, { useState } from 'react';
import ProductList from '../components/ProductList';
import axios from '../utils/axiosConfig';
import { useQuery } from 'react-query';
import {
  Container,
  InputLabel,
  TextField,
  Checkbox,
  FormControl,
  FormControlLabel,
  Select,
  InputAdornment,
  MenuItem,
  CircularProgress,
  Typography,
  Grid,
  Card,
  useMediaQuery,
  Divider,
  CardHeader,
  Box
} from '@mui/material';
import RangeSlider from '../components/RangeSlider';

const Search = () => {

  const smallScreen = useMediaQuery('(max-width: 600px)');
  //const mediumScreen = useMediaQuery('(max-width: 900px)');

  const { isLoading, isError, data, error } = useQuery('products', () =>
    axios(`/api/products`, {
      responseType: 'json',
    }).then((response) => response.data)
  );

  const [filters, setFilters] = useState({
    text: '',
    inStockOnly: false,
    category: '',
    priceRange: [20, 280],
  });

  const handleFilterChange = (filterName, filterValue) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: filterValue,
    }));
  };

  const handlePriceChange = (event, newValue) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      priceRange: newValue,
    }));
  };

  const filteredProducts = data
  ? data.filter((product) => {
      if (filters.inStockOnly && product.stock <= 0) {
        return false;
      }
      if (
        filters.priceRange &&
        (product.price < filters.priceRange[0] ||
          product.price > filters.priceRange[1])
      ) {
        return false;
      }
      if (
        (filters.category !== "All" && filters.category !== "") &&
        product.category.name !== filters.category
      ) {
        return false;
      }
      if (
        filters.text &&
        !product.name.toLowerCase().includes(filters.text.toLowerCase())
      ) {
        return false;
      }
      return true;
    })
  : [];

  const categories = ['All', ...new Set(data?.map((product) => product.category.name))];

  // if small screen, wrap the content in a card
  const ConditionalWrapper = ({ condition, wrapper, children }) => 
    condition ? wrapper(children) : children;

  return (
    <Container component={'main'}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={10} sm={8} md={6} sx={{ textAlign: 'center' }}>
          <ConditionalWrapper
            condition={!smallScreen}
            wrapper={children =>
              <Card sx={{ boxShadow: 12, borderRadius: '4px', my: 4 }}>
                <CardHeader title="Search Portfolio" />

                <Divider/>
                <Box sx={{ m: 2 }}>
                  {children}
                </Box>
              </Card>
            }
          >
            <Typography variant='h4' component="h3" sx={{ my: 4, display: { sm: 'none'} }}>
              Search Portfolio
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                value={filters.text}
                label="Search by Title"
                variant="outlined"
                onChange={(e) => handleFilterChange('text', e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">🔍</InputAdornment>,
                }}
              />
            </FormControl>

            <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                label="Category"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                {categories?.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category==="All" ? <em>All</em> : category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box>
              <InputLabel>Price Range</InputLabel>
              <RangeSlider
                priceRange={filters.priceRange}
                handlePriceChange={handlePriceChange}
              />
            </Box>

              
            <FormControlLabel
              label="Only show products in stock"
              control={
                <Checkbox
                  checked={filters.inStockOnly}
                  onChange={(e) => handleFilterChange('inStockOnly', e.target.checked)}
                />
              }
              sx={{ width: '90%', mx: 'auto' }}
            />
          </ConditionalWrapper>
        </Grid>
        {isLoading && <CircularProgress />}
        {isError && <div>Error: {error?.message ?? 'Unknown error'}</div>}
        <Grid item xs={11} md={10}>
          {data && <ProductList products={filteredProducts} title="Results"/>}
        </Grid>
        
      </Grid>
    </Container>
  );
};

export default Search;
