import { useState, useMemo } from 'react';
import {
  useMediaQuery,
  Container,
  Typography,
  Box,
  Divider,
  Card,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toMoneyFormat } from '../utils/helpers';
import { Link } from 'react-router-dom';

const Checkout = ({ cart, handleRemoveItem }) => {

  const [open, setOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState({
    item: null,
    index: null
  });

  //const smallScreen = useMediaQuery('(max-width: 600px)');
  const mediumScreen = useMediaQuery('(max-width: 900px)');

  // =================================================== process cart ===============================================
  // TODO

  const subtotal = useMemo(() => {
    const calculateSubtotal = () => {
      return cart.reduce((accumulator, item) => {
        let price = parseFloat(item.price);
        if (item.product_option?.price_difference) {
          price = parseFloat(item.product_option.price_difference) + parseFloat(item.price);
        }
        return accumulator + price;
      }, 0);
    };
    return calculateSubtotal();
  }, [cart]);

  // consolidate duplicates (set quantity of each item)
  // TODO

  // TODO
  const [tax, setTax] = useState("TBD");
  const [shipping, setShipping] = useState("TBD");
  const [total, setTotal] = useState("TBD");

  const panelContent = (
    <Box sx={{ m: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h5'>Subtotal:</Typography>
        <Typography variant='h5'>{toMoneyFormat(subtotal)}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='subtitle1'>Tax:</Typography>
        <Typography variant='subtitle1'>{tax}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='subtitle1'>Shipping:</Typography>
        <Typography variant='subtitle1'>{shipping}</Typography>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h5'>Total:</Typography>
        <Typography variant='h5'>{total}</Typography>
      </Box>
    </Box>
  );

  // ============================= remove item from cart confirmation dialog ==================================
  const handleDialogOpen = (item, index) => {
    setItemToRemove({
      item: item,
      index: index
    })
    setOpen(true);
  };

  const handleClose = (isRemoving) => {
    setOpen(false);
    isRemoving && handleRemoveItem(itemToRemove.index);
  };
  
  // Confirm remove item dialog (COMPONENT)
  const ConfirmRemoveItem = () => {
    return (
      <Dialog
        open={open}
        onClose={() => handleClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove {itemToRemove?.item?.name} from your cart?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="outlined" onClick={() => handleClose(true)} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <Container component={'main'}>
      <Typography variant='h3' component="h2" sx={{ my: 4, textAlign: 'center' }}>Checkout Page</Typography>

      {cart.length === 0 &&
        <Typography sx={{ my: 2, textAlign: 'center' }}>
          Cart is empty!
        </Typography>
      }

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>

          {/* iterate thru cart, displaying items */}
          {cart.map((item, index) => {
            return (
              <Card key={index}
                sx={{
                  mx: 'auto',
                  mb: 2,
                  textAlign: 'left',
                  display: 'flex',
                  boxShadow: 8,
                  borderRadius: '2px',
                  position: 'relative'
                }}
              >
                <IconButton
                  aria-label="remove item"
                  onClick={() => handleDialogOpen(item, index)}
                  sx={{ position: 'absolute', top: '0px', right: '0px' }}>
                  <CloseIcon />
                </IconButton>

                <Box component={'img'}
                  src={`http://localhost:3001/api/products/images/${item.image.id}?width=100&height=150`}
                  alt={item.name}
                  loading="lazy"
                  sx={{
                    m: 2,
                    boxShadow: 20,
                    borderRadius: '2px',
                  }}
                />
                <Box sx={{ p: 1, my: 2, width: 1, fontStyle: 'italic', textAlign: 'left', letterSpacing: 2  }}>
                  <Box
                    component={Link}
                    to={`/products/${item.id}`}
                    sx={{
                      color: 'inherit',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    <Typography variant='h5' component="h3" >
                      {item.name}
                    </Typography>
                  </Box>
                  <Box sx={{ mx: 2 }}>
                    {item.product_option?.option_1 &&
                      <Typography variant='subtitle2'>
                        {item.product_option.option_1.option_group.name}: {item.product_option.option_1.name}
                      </Typography>
                    }
                    {item.product_option?.option_2 &&
                      <Typography variant='subtitle2'>
                        {item.product_option.option_2.option_group.name}: {item.product_option.option_2.name}
                      </Typography>
                    }
                    {item.product_option?.option_3 &&
                      <Typography variant='subtitle2'>
                        {item.product_option.option_3.option_group.name}: {item.product_option.option_3.name}
                      </Typography>
                    }
                    <Typography variant='subtitle2'>Quantity: 1</Typography>
                    <Typography variant='subtitle2'>
                      Price: {toMoneyFormat(item.product_option?.price_difference ?
                        parseFloat(item.product_option.price_difference) + parseFloat(item.price)
                        : item.price)}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            )
          })}
        </Grid>

        {/* show panel with subtotal, tax, shipping, etc */}
        {cart.length > 0 && (
          <Grid item xs={12} md={4}>
            {!mediumScreen ? (
              <Card sx={{ boxShadow: 8, borderRadius: '4px' }}>{panelContent}</Card>
            ) : (
              <Box>{panelContent}</Box>
            )}
          </Grid>
        )}
      </Grid>

      <ConfirmRemoveItem />

    </Container>
  );
};

export default Checkout;