import { useState, useEffect } from 'react';
import { Box, Container, Typography, useMediaQuery, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';
import { toMoneyFormat } from '../utils/helpers';

const Product = () => {

  // get the product id from url
  const { id } = useParams();

  // query get all product options by product id
  // const product = product and productOptions data
  const { isLoading, isError, data: product, error } = useQuery('productOptions', () =>
    axios(`http://localhost:3001/api/products/${id}/options`, {
      responseType: 'json',
    }).then((response) => response.data)
  );

  // query get all option groups
  // example response (after calculating availableGroups)
  // const optionGroups = [
  //   { "id": 2, "name": "Material", "options": [{ "id": 6, "name": "Linen" }] },
  //   { "id": 1, "name": "Size", "options": [{ "id": 3, "name": "Large" }] },
  //   { "id": 3, "name": "Type", "options": [{ "id": 7, "name": "Original" }, { "id": 8, "name": "Print" }] }
  // ];
  const { isLoading: isLoadingOptionGroups, isError: isErrorOptionGroups, data: optionGroups, error: errorOptionGroups } = useQuery('optionGroups', () =>
    axios(`http://localhost:3001/api/options/groups`, {
      responseType: 'json',
    }).then((response) => response.data)
  );

  const [form, setForm] = useState({
    options: [null, null, null],
    productOption: null,
  });

  const smallScreen = useMediaQuery('(max-width: 600px)');
  //const mediumScreen = useMediaQuery('(max-width: 960px)');
  const width = smallScreen ? 300 : 800;
  const height = smallScreen ? 400 : 700;
  
  // what are the available options for this product?
  // compare optionGroups to productOptions
  const availableGroups = optionGroups?.filter((group) => {
    // check if any productOption has an associated option in this group
    const hasAssociatedOption = product?.product_options?.some((option) => (
      option.option_1?.option_group.id === group.id ||
      option.option_2?.option_group.id === group.id ||
      option.option_3?.option_group.id === group.id
    ));
  
    if (!hasAssociatedOption) {
      // if no productOption has an associated option in this group, filter out all options
      return false;
    }
  
    // otherwise, filter out options that do not have any associated productOptions
    group.options = group.options?.filter((option) => (
      product?.product_options?.some((po) => (
        po.option_1?.name === option.name ||
        po.option_2?.name === option.name ||
        po.option_3?.name === option.name
      ))
    ));
  
    // include this option group if it has any options remaining
    return group.options?.length > 0;
  });
  
  const handleFormChange = (index, value) => {
    setForm(prevState => {
      const newOptions = [...prevState.options];
      newOptions[index] = value;

      // calculate productOption and set in form
      const currProductOption = product?.product_options?.find(option => {
        const sortedPoOptions = [
          option.option_1?.name || null,
          option.option_2?.name || null,
          option.option_3?.name || null,
        ].sort();
  
        const sortedOptionSelection = [...newOptions].sort()
        return sortedPoOptions.every(
          (option, index) => option === null || option === sortedOptionSelection[index]
        );
      });
      return {
        ...prevState,
        options: newOptions,
        productOption: currProductOption,
      };
    });
  };

  const price = form.productOption
    ? parseFloat(product?.price ?? 0) +
      parseFloat(form.productOption.price_difference)
    : parseFloat(product?.price ?? 0);

  const stock = form.productOption?.stock ?? product?.stock ?? 0;

  // useEffect(() => {
  //   console.log("form",form);
  // }, [form]);

  if (isLoading || isLoadingOptionGroups) {
    return <Container component={'main'}>Loading...</Container>;
  }

  if (isError || isErrorOptionGroups) {
    return <Container component={'main'}>Error: {(error?.message || errorOptionGroups?.message) ?? 'Unknown error'}</Container>;
  }
  
  return (
    <Container component={'main'}>
      {product && (
        <Box sx={{ mx: 'auto', my: 2, textAlign: 'center' }}>
          <Typography variant='h6' gutterBottom>
            {product.name}
          </Typography>
          <img
            src={`http://localhost:3001/api/products/images/${product.image.id}?width=${width}&height=${height}`}
            alt={product.name}
            loading="lazy"
          />
          <Typography gutterBottom>
            {toMoneyFormat(price)}
          </Typography>
          {stock <= 3 && (
            <Typography>
              Only {stock} left in stock!
            </Typography>
          )}
          {availableGroups.length > 0 && (
            <Box sx={{ mx: 'auto', my: 2, textAlign: 'center', display: 'flex', flexWrap: 'nowrap', width: '90%' }}>
              {availableGroups.map((optionGroup, index) => (
                <FormControl
                  fullWidth
                  key={`option-group-${index + 1}`}
                  sx={{ mx: 1 }}
                >
                  <InputLabel
                    id={`option-group-${index + 1}-label`}
                  >
                    {optionGroup.name}
                  </InputLabel>
                  <Select
                    labelId={`option-group-${index + 1}-label`}
                    value={form.options[index] || ''}
                    onChange={(e) => handleFormChange(index, e.target.value)}
                  >
                    {optionGroup.options?.map((opt) => (
                      <MenuItem
                        key={opt.id}
                        value={opt.name}
                      >
                        {opt.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ))}
            </Box>
          )}
          <Typography gutterBottom>
            {product.description}
          </Typography>
        </Box>
      )}
    </Container>
  );
  
  
};

export default Product;