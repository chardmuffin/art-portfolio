import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CreateProductWithOptions = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [productOptions, setProductOptions] = useState([]);
  const [image, setImage] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleOptionGroupChange = (event) => {
    const optionGroup = event.target.name;
    const isChecked = event.target.checked;

    if (isChecked) {
      setProductOptions([...productOptions, optionGroup]);
    } else {
      setProductOptions(productOptions.filter((option) => option !== optionGroup));
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const optionGroups = [
    { id: 1, name: 'Option Group 1' },
    { id: 2, name: 'Option Group 2' },
    { id: 3, name: 'Option Group 3' }
  ];

  return (
    <Container component={'main'}>
      <Grid container justifyContent="center">
        <Grid item xs={12} sx={{ textAlign: 'center', my: 2 }}>
          <Typography variant="h5">New Product (With Options)</Typography>
        </Grid>
      </Grid>

      <form>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="product-name"
              label="Product Name"
              variant="outlined"
              value={name}
              onChange={handleNameChange}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Product Options</FormLabel>
              <FormGroup>
                {optionGroups.map((optionGroup) => (
                  <FormControlLabel
                    key={optionGroup.id}
                    control={
                      <Checkbox
                        name={optionGroup.name}
                        checked={productOptions.includes(optionGroup.name)}
                        onChange={handleOptionGroupChange}
                      />
                    }
                    label={optionGroup.name}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Button variant="contained" component="label">
              Upload Image
              <input type="file" hidden onChange={handleImageChange} />
            </Button>
            {image && <Typography>{image.name}</Typography>}
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default CreateProductWithOptions;