import { useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, Button, Divider, TextField, CardHeader, Snackbar, Slide } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from '../utils/axiosConfig';

const Contact = () => {
  const initialValues = {
    name: '',
    subject: '',
    message: '',
    email: '',
    phone: '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    subject: Yup.string().notRequired(),
    message: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email format').notRequired(),
    phone: Yup.string().notRequired(),
  });

  const handleSubmit = async (values, actions) => {

    const data = {
      name: values.name,
      subject: values.subject,
      message: values.message,
      email: values.email,
      phone: values.phone
    };
  
    try {
      await axios.post('/api/orders/contact', data);
      console.log('Message sent successfully');
      setSnackbarType('success');
      actions.setSubmitting(false);
      actions.resetForm();
    } catch (error) {
      console.error('Message failed to send', error);
      setSnackbarType('error');
      actions.setSubmitting(false);
    } finally {
      setSnackbarOpen(true);
    }
}

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarType, setSnackbarType] = useState('success');

  return (
    <Container component={'main'}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <Card sx={{ my: 4, boxShadow: 8, borderRadius: '4px' }}>
            <CardHeader title="Get in Touch" sx={{ textAlign: 'center' }} />
            <Divider />
            <CardContent>
              <Typography variant="body1" sx={{ textAlign: 'center', mb: 4 }}>
                Thank you for your interest in my art! I love hearing from fellow art enthusiasts, collectors, and anyone interested in my work. Whether you have a question about a specific piece, would like to discuss a custom commission, or simply want to share your thoughts, I appreciate your messages and will respond as soon as possible.
              </Typography>
              <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ touched, errors }) => (
                  <Form>
                    <Grid container spacing={2} justifyContent='center' >
                      <Grid item xs={10} md={8}>
                        <Field
                          as={TextField}
                          fullWidth
                          label="Name"
                          name="name"
                          variant="outlined"
                          error={touched.name && !!errors.name}
                          helperText={touched.name && errors.name}
                        />
                      </Grid>
                      <Grid item xs={10} md={8}>
                        <Field
                          as={TextField}
                          fullWidth
                          label="Subject"
                          name="subject"
                          variant="outlined"
                          error={touched.subject && !!errors.subject}
                          helperText={touched.subject && errors.subject}
                        />
                      </Grid>
                      <Grid item xs={10} md={8}>
                        <Field
                          as={TextField}
                          fullWidth
                          label="Message"
                          name="message"
                          variant="outlined"
                          multiline
                          rows={4}
                          error={touched.message && !!errors.message}
                          helperText={touched.message && errors.message}
                        />
                      </Grid>
                      <Grid item xs={10} md={8}>
                        <Grid container spacing={2} justifyContent='space-between'>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              fullWidth
                              label="Email"
                              name="email"
                              variant="outlined"
                              error={touched.email && !!errors.email}
                              helperText={touched.email && errors.email}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              fullWidth
                              label="Phone"
                              name="phone"
                              variant="outlined"
                              error={touched.phone && !!errors.phone}
                              helperText={touched.phone && errors.phone}
                            />
                          </Grid>
                        </Grid>
                        
                      </Grid>
                      <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                          Send Message
                        </Button>
                      </Grid>
                    </Grid>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        TransitionComponent={Slide}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert onClose={() => setSnackbarOpen(false)} severity={snackbarType} elevation={6} variant="filled">
          {snackbarType === 'success' ? 'Message sent successfully!' : 'Failed to send message!'}
        </MuiAlert>
      </Snackbar>

    </Container>
  );
};

export default Contact;