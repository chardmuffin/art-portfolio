import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  useMediaQuery,
} from '@mui/material';

const stateOptions = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];

const ShippingAddressForm = ({ formData, setFormData }) => {

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  //const smallScreen = useMediaQuery('(max-width: 600px)');
  const mediumScreen = useMediaQuery('(max-width: 900px)');

  const CityAndStateGridItems = () => (
    <>
      <Grid item xs={6} md={3}>
        <TextField
          fullWidth
          required
          id='city'
          name='city'
          label='City'
          value={formData.city}
          onChange={handleFormChange}
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <FormControl fullWidth required>
          <InputLabel id='state-label'>State</InputLabel>
          <Select
            labelId='state-label'
            id='state'
            name='state'
            value={formData.state}
            onChange={handleFormChange}
            label='State'
          >
            {stateOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </>
  );

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={12}>
        <TextField
          fullWidth
          required
          id='name'
          name='name'
          label='Full Name'
          value={formData.name}
          onChange={handleFormChange}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          required
          id='addressLine1'
          name='addressLine1'
          label='Address Line 1'
          value={formData.addressLine1}
          onChange={handleFormChange}
        />
      </Grid>
      {!mediumScreen && <CityAndStateGridItems />}
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          id='addressLine2'
          name='addressLine2'
          label='Address Line 2'
          value={formData.addressLine2}
          onChange={handleFormChange}
        />
      </Grid>
      {mediumScreen && <CityAndStateGridItems />}
      <Grid item xs={6} md={3}>
        <TextField
          fullWidth
          required
          id='zip'
          name='zip'
          label='Zip Code'
          value={formData.zipCode}
          onChange={handleFormChange}
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <TextField
          fullWidth
          id='phone'
          name='phone'
          label='Phone'
          value={formData.phone}
          onChange={handleFormChange}
        />
      </Grid>
    </Grid>
  );
}

export default ShippingAddressForm;