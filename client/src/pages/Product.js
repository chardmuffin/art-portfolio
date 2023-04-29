import { useState, useEffect } from 'react';
import { Snackbar, Box, CircularProgress, Container, Typography, useMediaQuery, FormControl, InputLabel, MenuItem, Select, Divider, Grid, Button, IconButton, Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import { useParams } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { useQuery } from 'react-query';
import { toMoneyFormat } from '../utils/helpers';

const Product = ({ handleAddToCart }) => {

  // get the product id from url
  const { id } = useParams();

  // query get all possible product options by product id
  // const product = product and productOptions data
  const { isLoading, isError, data: product, error } = useQuery('productOptions', () =>
    axios(`/api/products/${id}/options`, {
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
    axios(`/api/options/groups`, {
      responseType: 'json',
    }).then((response) => response.data)
  );

  // selectedItem is an object that will contain the product data AND the selected productOption's data (based on combination of chosen options)
  const [form, setForm] = useState({
    options: [null, null, null],
    selectedItem: null
  });

  // for products with no product_options, update selectedItem = product once axios fetches the product
  useEffect(() => {
    setForm(prevState => ({
      ...prevState,
      selectedItem: product || null,
    }));
  }, [product]);

  // alert is shown if item added to cart
  const [showAlert, setShowAlert] = useState(false);

  const smallScreen = useMediaQuery('(max-width: 600px)');
  const mediumScreen = useMediaQuery('(max-width: 960px)');
  const width = smallScreen ? 300 : mediumScreen ? 550 : 800;
  const height = smallScreen ? 400 : 700;
  
  // what are the available options for this product?
  // compare optionGroups to productOptions
  const availableGroups = optionGroups?.filter((group) => {
    // check if any productOptions has an associated option in this group
    const hasAssociatedOption = product?.product_options?.some((option) => (
      option.option_1?.option_group.id === group.id ||
      option.option_2?.option_group.id === group.id ||
      option.option_3?.option_group.id === group.id
    ));
  
    if (!hasAssociatedOption) {
      // if no productOption has an associated option in this group, filter out this optionGroup
      return false;
    }
  
    // otherwise, only filter out options within the group that do not have any associated productOptions
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
      const productOption = product?.product_options?.find(option => {
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

      // add the product data to the selectedItem object to be saved
      return {
        ...prevState,
        options: newOptions,
        selectedItem: productOption ? {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          image: product.image,
          product_option: productOption
        } : product
      };
    });
  };

  // get the price range for all product options in string format
  const priceRangeString = product?.product_options ? (() => {
    const prices = product?.product_options?.map(option => parseFloat(product.price) + parseFloat(option.price_difference)).sort((a, b) => a - b);
    const minPrice = prices[0];
    const maxPrice = prices[prices.length - 1];
    if (isNaN(minPrice)) return toMoneyFormat(product?.price);
    if (minPrice === maxPrice) return toMoneyFormat(minPrice);
    return `${toMoneyFormat(minPrice)} - ${toMoneyFormat(maxPrice)}`;
  })() : toMoneyFormat(product?.price);

  // calculate the price if options are selected
  const price = form.selectedItem?.product_option
    ? parseFloat(product?.price ?? 0) +
      parseFloat(form.selectedItem?.product_option.price_difference)
    : parseFloat(product?.price ?? 0);

  const stock = form.selectedItem?.product_option?.stock ?? product?.stock ?? 0;

  if (isLoading || isLoadingOptionGroups) {
    return <Container component={'main'}><CircularProgress /></Container>;
  }

  if (isError || isErrorOptionGroups) {
    return <Container component={'main'}>Error: {(error?.message || errorOptionGroups?.message) ?? 'Unknown error'}</Container>;
  }

  // animate the add to cart button
  
  return (
    <Container component={'main'}>
      {product && (
        <Box sx={{ mx: 'auto', my: 2, textAlign: 'center' }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Box component={'img'}
                src={`${process.env.REACT_APP_API_BASE_URL}/api/products/images/${product.image.id}?width=${width}&height=${height}`}
                alt={product.name}
                loading="lazy"
                sx={{
                  my: 2,
                  boxShadow: '4px 4px 20px rgba(0, 0, 0, 0.8)',
                  borderRadius: '2px',
                  maxWidth: '100%'
                }}
              />
            </ Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ my: 2, fontStyle: 'italic', textAlign: 'left', letterSpacing: 2 }}>
                <Typography variant='h4' component="h2" >
                  {product.name}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  Fine Art by Richard Huffman
                </Typography>
                <Typography>
                  {priceRangeString}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />

              {availableGroups.length > 0 && (
                <Box sx={{ mx: 'auto', my: 2, textAlign: 'center', display: 'flex', width: '100%' }}>
                  {availableGroups.map((optionGroup, index) => (
                    <FormControl
                      fullWidth
                      key={`option-group-${index + 1}`}
                      sx={{ mx: 1, my: 1 }}
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
                        fullWidth
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
              {stock <= 3 && (
                stock > 0
                ? <Typography sx={{ fontStyle: 'italic', textAlign: 'center', mb: 2, mt: -1 }}>
                    {stock} left in stock!
                  </Typography>
                : <Typography>
                    SOLD
                  </Typography>
              )}
              {((form.selectedItem?.product_option || availableGroups.length <= 0) && stock >= 1) &&
                <Box sx={{ mx: 'auto', my: 2, textAlign: 'center', display: 'flex', flexWrap: 'nowrap', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant='h5' component='h3' sx={{ textAlign: 'left' }}>
                    Total: {toMoneyFormat(price)}
                  </Typography>
                  <Button
                    variant='contained'
                    onClick={() => {
                      handleAddToCart(form.selectedItem);
                      setShowAlert(true);
                    }}
                  >
                    <Typography variant='button'>add to cart</Typography>
                  </Button>
                </Box>
              }
              
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography gutterBottom sx={{ typography: 'subtitle2', textAlign: 'left' }}>
            About the Painting
          </Typography>
          <Typography sx={{ textAlign: 'left', mx: 2 }}>
            {product.description}
          </Typography>
        </Box>
      )}
      <Snackbar
        open={showAlert}
        autoHideDuration={4000}
        onClose={() => setShowAlert(false)}
        TransitionComponent={Slide}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        message={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DoneIcon fontSize='small' sx={{ mr: 1 }} /> 
            <Typography variant='body1'>Added to cart!</Typography>
          </Box>
        }
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setShowAlert(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Container>
  );
};

export default Product;