import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
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
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined'

const drawerWidth = 240;

const Header = (props) => {
  const logout = event => {
    event.preventDefault();

  };

  // <Link to="/"><h1>Home</h1></Link>
  // <Link to="/search">Search</Link>
  // <Link to="/checkout">Cart</Link>

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Original Paintings
      </Typography>
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
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ marginLeft: 'auto' }}>
            <IconButton
              component={Link}
              to={'/checkout'}
              color="inherit"
              sx={{ mr: 2, display: { sm: 'none' }, marginRight: 0 }}
            >
              <ShoppingCartOutlined />
            </IconButton> 
          </Box>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Original Paintings
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Button component={Link} to={'/'} sx={{ color: '#fff' }}>
              Browse
            </Button>
            <Button component={Link} to={'/search'} sx={{ color: '#fff' }}>
              Search
            </Button>
            <Button component={Link} to={'/about'} sx={{ color: '#fff' }}>
              About
            </Button>
            <IconButton component={Link} to={'/checkout'} sx={{ color: '#fff' }}>
              <ShoppingCartOutlined />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
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
      <Box sx={{ p: 3 }}>
        <Toolbar />
        
      </Box>
    </Box>
  );
};

export default Header;