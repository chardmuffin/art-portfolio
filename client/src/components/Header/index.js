import { useState, useEffect } from 'react';
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
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';

import DarkModeSwitch from '../DarkModeSwitch';

const drawerWidth = 240;

const Header = ({ window, cartCount, ColorModeContext, isCartAnimating }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <>
      <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
        <Box component={Link} to={'/'} sx={{color: 'inherit', textDecoration: 'none' }}>
          <Typography variant="h6" component="h1" mt={2}>
            Richard Huffman
          </Typography>
          <Typography variant="subtitle2" sx={{ mx: 2, fontStyle: 'italic', letterSpacing: 2, mb: 2 }}>
            Fine Art
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
          <ListItem disablePadding>
            <ListItemButton component={Link} to={'/contact'} sx={{ textAlign: 'center' }}>
              <ListItemText primary={'Contact'} />
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
          ColorModeContext={ColorModeContext}
        />
      </Box>
    </>
  );

  // for drawer
  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'nowrap' }}>

        {/* top bar (mobile) */}
        <AppBar component="nav" position="fixed" color="primary" sx={{ bottom: 'auto', top: 0, display: { sm: 'none' }, opacity: '0.85', minHeight: 'none' }}>
          <Toolbar>
            <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerToggle}>
              <MenuIcon sx={{ opacity: '1' }} />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton
              className={isCartAnimating ? 'cart-icon wiggle' : 'cart-icon'}
              component={Link}
              to={'/checkout'}
              color="inherit"
            >
              <Typography>({cartCount})</Typography>
              <ShoppingCartOutlined sx={{ opacity: '1' }}/>
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* spacing before content (mobile) */}
        <Box sx={{ display: { sm: 'none' }, my: 3}}>
          <Toolbar />
        </Box>

        {/* top bar (tablet/desktop) */}
        <AppBar component="nav" position="static" color="primary" sx={{ display: { xs: 'none', sm: 'block' } }}>
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
              <Typography variant="h5" component="h1" >
                Richard Huffman
              </Typography>
              <Typography variant="subtitle2" sx={{ mx: 2, fontStyle: 'italic', letterSpacing: 2 }}>
                Fine Art
              </Typography>
            </Box>

            <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
              <Button component={Link} to={'/'} color="inherit">
                Browse
              </Button>
              <Button component={Link} to={'/search'} color="inherit">
                Search
              </Button>
              <Button component={Link} to={'/about'} color="inherit">
                About
              </Button>
              <Button component={Link} to={'/contact'} color="inherit">
                Contact
              </Button>
              <IconButton
                className={isCartAnimating ? 'wiggle' : ''}
                component={Link}
                to={'/checkout'}
                color="inherit"
              >
                <Typography>({cartCount})</Typography>
                {cartCount > 0 ? <ShoppingCartTwoToneIcon />: <ShoppingCartOutlined />}
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
      </Box>

      {/* dark mode switch (desktop) */}
      <Box sx={{ position: 'absolute', right: 0, display: { xs: 'none', sm: 'block' }, }}>
        <DarkModeSwitch 
          ColorModeContext={ColorModeContext}
        />
      </Box>
    </>
  );
};

export default Header;