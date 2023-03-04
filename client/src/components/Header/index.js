import { useState } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined';

import DarkModeSwitch from '../DarkModeSwitch';


const drawerWidth = 240;

const Header = (props) => {
  const logout = event => {
    event.preventDefault();

  };

  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <>
      <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
        <Box component={Link} to={'/'} sx={{color: 'inherit', textDecoration: 'none'}}>
          <Typography variant="h6" sx={{ my: 2 }}>
            Original Paintings
          </Typography>
        </Box>
        
        <Divider />

        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to={'/'} sx={{ textAlign: 'center' }}>
              <ListItemText primary={'Browse'} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to={'/search'} sx={{ textAlign: 'center' }}>
              <ListItemText primary={'Search'} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to={'/about'} sx={{ textAlign: 'center' }}>
              <ListItemText primary={'About'} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      <Divider />

      <Box sx={{ flexGrow: 1 }}/>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          borderRadius: 1,
          p: 3
        }}
      >
        <DarkModeSwitch
          ColorModeContext={props.ColorModeContext}
        />
      </Box>
    </>
  );

  // for drawer
  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>

      {/* bottom bar (mobile) */}
      <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0, display: { sm: 'none'} }}>
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton component={Link} to={'/checkout'} color="inherit">
            <ShoppingCartOutlined />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* top bar (tablet/desktop) */}
      <AppBar component="nav" color="primary" sx={{ display: { xs: 'none', sm: 'block' } }}>
        <Toolbar>
          <Box
            component={Link}
            to={'/'}
            sx={{
                flexGrow: 1,
                display: { xs: 'none', sm: 'block' },
                color: 'inherit',
                textDecoration: 'none'
              }}
          >
            <Typography variant="h4" component="h1">
              Original Paintings
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Button component={Link} to={'/'} color="inherit">
              Browse
            </Button>
            <Button component={Link} to={'/search'} color="inherit">
              Search
            </Button>
            <Button component={Link} to={'/about'} color="inherit">
              About
            </Button>
            <IconButton component={Link} to={'/checkout'} color="inherit">
              <ShoppingCartOutlined />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* drawer (mobile) */}
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* space the height of header before content and dark mode switch (desktop) */}
      <Box sx={{ pb: 3, display: { xs: 'none', sm: 'block' }, ml: 'auto' }}>
        <Toolbar />
        <DarkModeSwitch
          ColorModeContext={props.ColorModeContext}
        />
      </Box>

    </Box>
  );
};

export default Header;