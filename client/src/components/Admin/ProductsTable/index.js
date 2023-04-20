import React, { useState } from 'react';
import axios from '../../../utils/axiosConfig';
import { useQuery } from 'react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Collapse,
  Paper,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ProductsTable = () => {
  const { isLoading, isError, data, error } = useQuery('products', () =>
    axios('/api/products', {
      responseType: 'json',
    }).then((response) => response.data)
  );

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography> There was an error: {error.message}</Typography>;

  return (
    <TableContainer component={Paper}>
      <Table size="small" padding="dense">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Option Count</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Edit</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((product) => (
            <React.Fragment key={product.id}>
              <ProductRow product={product} />
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const ProductRow = ({ product }) => {
  const [open, setOpen] = useState(false);

  const productOptionsQuery = useQuery(['productOptions', product.id], () =>
    axios(`/api/products/${product.id}/options`, {
      responseType: 'json',
    }).then((response) => response.data.product_options)
  );

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <TableRow>
        <TableCell>
          {product.product_option_count > 0 && (
            <IconButton size="small" onClick={handleToggle}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
        <TableCell>{product.id}</TableCell>
        <TableCell>{product.name}</TableCell>
        <TableCell>{product.description}</TableCell>
        <TableCell>{product.price}</TableCell>
        <TableCell>{product.stock}</TableCell>
        <TableCell>{product.product_option_count}</TableCell>
        <TableCell>{product.category.name}</TableCell>
        <TableCell>
          <Box component={'img'}
            src={`http://localhost:3001/api/products/images/${product.image.id}?width=50`}
            alt={product.name}
            loading="lazy"
            sx={{ maxWidth: '100%', maxHeight: '100%', boxShadow: 4 }}
          />
        </TableCell>
        <TableCell>
          <IconButton>
            <EditIcon />
          </IconButton>
        </TableCell>
        <TableCell>
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      {productOptionsQuery.data && (
        <TableRow>
          <TableCell sx={{ p: 0 }} colSpan={12}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ mx: 'auto', width: '70%' }}>
                <Typography variant="h6" gutterBottom>
                  {product.name} - Product Options
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Adjusted Price</TableCell>
                        <TableCell>Stock</TableCell>
                        <TableCell>Options</TableCell>
                        <TableCell>Edit</TableCell>
                        <TableCell>Delete</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {productOptionsQuery.data.map((option) => (
                        <TableRow
                          key={option.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell>{option.id}</TableCell>
                          <TableCell>
                            {parseFloat(option.price_difference) + parseFloat(product.price)}
                          </TableCell>
                          <TableCell>{option.stock}</TableCell>
                          <TableCell>
                            {option.option_1 && (
                              <Box>
                                {option.option_1.option_group.name}: {option.option_1.name}
                              </Box>
                            )}
                            {option.option_2 && (
                              <Box>
                                {option.option_2.option_group.name}: {option.option_2.name}
                              </Box>
                            )}
                            {option.option_3 && (
                              <Box>
                                {option.option_3.option_group.name}: {option.option_3.name}
                              </Box>
                            )}
                          </TableCell>
                          <TableCell>
                            <IconButton>
                              <EditIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <IconButton>
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default ProductsTable;