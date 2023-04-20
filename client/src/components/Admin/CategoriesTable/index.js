import axios from '../../../utils/axiosConfig';
import { useQuery } from 'react-query';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, IconButton, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CategoriesTable = () => {
  const { isLoading, isError, data, error } = useQuery('categories', () =>
    axios('/api/categories', {
      responseType: 'json',
    }).then((response) => response.data)
  );

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography> There was an error: {error.message}</Typography>;

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Category Name</TableCell>
            <TableCell>Product Count</TableCell>
            <TableCell>Edit</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.id}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.product_count}</TableCell>
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
    </>
  );
};

export default CategoriesTable;
