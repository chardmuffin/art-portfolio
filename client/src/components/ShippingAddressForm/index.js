import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Button,
  Box,
  FormHelperText
} from '@mui/material';
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

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

const ShippingAddressSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters')
    .required('Name is required'),
  addressLine1: Yup.string()
    .min(5, 'Address Line 1 must be at least 5 characters')
    .max(100, 'Address Line 1 must be at most 100 characters')
    .required('Address Line 1 is required'),
  addressLine2: Yup.string()
    .max(100, 'Address Line 2 must be at most 100 characters'),
  city: Yup.string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must be at most 50 characters')
    .required('City is required'),
  state: Yup.string()
    .required('State is required'),
  zip: Yup.string()
    .matches(/^[0-9]{5}(?:-[0-9]{4})?$/, 'Invalid Zip Code')
    .required('Zip Code is required'),
  phone: Yup.string()
    .matches(
      /^\+?[\d\s\-().]+$/,
      'Phone number must be a valid format (e.g., +1 123-456-7890)'
    )
});

const ShippingAddressForm = ({ onAddressSubmit, mediumScreen, shippingInfo }) => {

  return (
    <Formik
      initialValues={shippingInfo}
      validationSchema={ShippingAddressSchema}
      onSubmit={onAddressSubmit}
    >
      {({ errors, touched, handleSubmit }) => (
        <Form id="shippingAddressForm">
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Field as={TextField} fullWidth required id="name" name="name" label="Full Name" />
              {errors.name && touched.name ? (
                <FormHelperText error>{errors.name}</FormHelperText>
              ) : null}
            </Grid>
            <Grid item xs={12}>
              <Field
                as={TextField}
                fullWidth
                required
                id="addressLine1"
                name="addressLine1"
                label="Address Line 1"
              />
              {errors.addressLine1 && touched.addressLine1 ? (
                <FormHelperText error>{errors.addressLine1}</FormHelperText>
              ) : null}
            </Grid>
            <Grid item xs={12}>
              <Field
                as={TextField}
                fullWidth
                id="addressLine2"
                name="addressLine2"
                label="Address Line 2"
              />
              {errors.addressLine2 && touched.addressLine2 ? (
                <FormHelperText error>{errors.addressLine2}</FormHelperText>
              ) : null}
            </Grid>
            <Grid item xs={6}>
              <Field as={TextField} fullWidth required id="city" name="city" label="City" />
              {errors.city && touched.city ? (
                <FormHelperText error>{errors.city}</FormHelperText>
              ) : null}
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth required>
                <InputLabel id="state-label">State</InputLabel>
                <Field as={Select} labelId="state-label" id="state" name="state" label="State">
                  {stateOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Field>
                {errors.state && touched.state ? (
                  <FormHelperText error>{errors.state}</FormHelperText>
                ) : null}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <Field as={TextField} fullWidth required id="zip" name="zip" label="Zip Code" />
              {errors.zip && touched.zip ? (
                <FormHelperText error>{errors.zip}</FormHelperText>
              ) : null}
            </Grid>
            <Grid item xs={6}>
              <Field as={TextField} fullWidth id="phone" name="phone" label="Phone" />
              {errors.phone && touched.phone ? (
                <FormHelperText error>{errors.phone}</FormHelperText>
              ) : null}
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Button variant="contained" onClick={handleSubmit}>
                {!mediumScreen ? "Calculate Tax & Shipping" : "Next"}
              </Button>
            </Grid>
          </Grid>
          
        </Form>
      )}
    </Formik>
  );
}

export default ShippingAddressForm;