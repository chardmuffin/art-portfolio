import { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'react-query';
import axios from '../../../utils/axiosConfig';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  Grid,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const CreateProductOption = ({ product }) => {
  const [productOption, setProductOption] = useState({
    price_difference: '',
    stock: '',
    product_id: product.id,
    option_id_1: '',
    option_id_2: '',
    option_id_3: ''
  });
  const [optionGroups, setOptionGroups] = useState({
    group1: '',
    group2: '',
    group3: ''
  })

  const optionGroupsQuery = useQuery('optionGroups', () =>
    axios.get('/api/options/groups').then((res) => res.data)
  );

  const createProductOptionMutation = useMutation(
    async () => {
      const consolidatedProductOption = { ...productOption };
      let counter = 1;

      for (let i = 1; i <= 3; i++) {
        if (productOption[`option_id_${i}`]) {
          consolidatedProductOption[`option_id_${counter}`] = productOption[`option_id_${i}`];
          counter++;
        }
      }

      for (let i = counter; i <= 3; i++) {
        delete consolidatedProductOption[`option_id_${i}`];
      }
      console.log("creating productOption: ", consolidatedProductOption)
      await axios.post('/api/products/options', consolidatedProductOption, { withCredentials: true });
    },
    {
      onSuccess: () => {
        setProductOption({
          price_difference: '',
          stock: '',
          product_id: product.id,
          option_id_1: '',
          option_id_2: '',
          option_id_3: ''
        })
        alert('Product option created successfully!');
      },
      onError: (error) => {
        alert('There was an error creating the product option:\n\n' + error.message);
      },
    }
  );

  const handleInputChange = async (event) => {
    const { name, value } = event.target;
    setProductOption({ ...productOption, [name]: value });
  };

  const handleOptionGroupChange = (event, groupIndex) => {
    if (event.target.value === '') {
      setProductOption({ ...productOption, [`option_id_${groupIndex}`]: '' });
    }
    setOptionGroups({ ...optionGroups, [`group${groupIndex}`]: event.target.value });
  };  

  const handleOptionChange = (event, optionIndex) => {
    setProductOption({ ...productOption, [`option_id_${optionIndex}`]: event.target.value });
  };

  const getAvailableOptionGroups = (currentGroup) => {
    return optionGroupsQuery.data.filter(
      (og) =>
        og.id === currentGroup ||
        (og.id !== optionGroups.group1 && og.id !== optionGroups.group2 && og.id !== optionGroups.group3)
    );
  };

  if (optionGroupsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card sx={{ boxShadow: 8, borderRadius: '4px', mt: 2 }}>
      <CardHeader title={`${product.name} - Add Options`} sx={{ pb: 0 }} />
      <CardContent>
        <FormControl noValidate autoComplete="off">
          <TextField
            fullWidth
            label="Price Difference"
            name="price_difference"
            value={productOption.price_difference}
            onChange={handleInputChange}
            type="number"
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Stock"
            name="stock"
            value={productOption.stock}
            onChange={handleInputChange}
            type="number"
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          {optionGroupsQuery.data && (
            <Grid container spacing={2}>
              {Array.from({ length: 3 }, (_, index) => (
                <Grid item container xs={12} spacing={2} key={`row-${index + 1}`}>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>{`Option Group ${index + 1}`}</InputLabel>
                      <Select
                        value={optionGroups[`group${index + 1}`]}
                        onChange={(e) => handleOptionGroupChange(e, index + 1)}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {getAvailableOptionGroups(optionGroups[`group${index + 1}`]).map((optionGroup) => (
                          <MenuItem key={`group${index + 1}-option-${optionGroup.id}`} value={optionGroup.id}>
                            {optionGroup.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  {optionGroups[`group${index + 1}`] && (
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>{`Option ${index + 1}`}</InputLabel>
                        <Select
                          value={productOption[`option_id_${index + 1}`]}
                          onChange={(e) => handleOptionChange(e, index + 1)}
                          disabled={!optionGroups[`group${index + 1}`]}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {optionGroups[`group${index + 1}`] &&
                            optionGroupsQuery.data
                              .find((og) => og.id === optionGroups[`group${index + 1}`])
                              .options.map((option) => (
                                <MenuItem key={`option${index + 1}-option-${option.id}`} value={option.id}>
                                  {option.name}
                                </MenuItem>
                              ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}
                </Grid>
              ))}
            </Grid>
          )}
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => createProductOptionMutation.mutate()}
            sx={{ mt: 2 }}
          >
            Save
          </Button>
        </FormControl>
      </CardContent>
    </Card>
  );
};

export default CreateProductOption;