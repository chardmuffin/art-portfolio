import axios from '../../../utils/axiosConfig';
import { useQuery } from 'react-query';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Box, IconButton, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const OptionsAndGroupsTable = () => {
  const { isLoading, isError, data, error } = useQuery('optionGroups', () =>
    axios('/api/options/groups', {
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
            <TableCell>Option Group Name</TableCell>
            <TableCell>Options</TableCell>
            <TableCell>Edit</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((optionGroup) => (
            <TableRow key={optionGroup.id}>
              <TableCell>{optionGroup.id}</TableCell>
              <TableCell>{optionGroup.name}</TableCell>
              <TableCell>
                {optionGroup.options.map((option, index) => (
                  <Box key={option.id}>
                    {option.name}
                    {index < optionGroup.options.length - 1 && ',\n'}
                  </Box>
                ))}
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
    </>
  );
};

export default OptionsAndGroupsTable;
