import { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Typography } from '@mui/material';

import { capitalizeFirstLetter } from '../../utils/helpers';

const DarkModeSwitch = (props) => {

  const { ColorModeContext } = props;

  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'nowrap'
      }}
    >
      <Typography variant='caption'>
        {capitalizeFirstLetter(theme.palette.mode)} Mode
      </Typography>
      <IconButton onClick={colorMode.toggleColorMode} color="inherit">
        {theme.palette.mode === 'dark' ? <Brightness7Icon fontSize='small'/> : <Brightness4Icon fontSize='small'/>}
      </IconButton>
    </Box>
  );
};

export default DarkModeSwitch;