import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

// Confirm remove item popup dialog (COMPONENT)
const ConfirmRemoveItemDialog = ({ open, itemToRemove, handleClose }) => {
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

export default ConfirmRemoveItemDialog;
