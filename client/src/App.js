import { useMemo, createContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Search from './pages/Search';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Product from './pages/Product';
import Contact from './pages/Contact';

import { usePersistentState } from './utils/hooks';
import PaymentComplete from './pages/PaymentComplete';

const ColorModeContext = createContext({ toggleColorMode: () => {} });

function App() {
  const systemMode = useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light';
  const [mode, setMode] = usePersistentState("RHArt-darkmode", systemMode);
  
  const [isCartAnimating, setIsCartAnimating] = useState(false);

  const colorMode = useMemo(() => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [setMode],
  );

  const theme = useMemo(() =>
      createTheme({
        palette: {
          mode,
        },
        typography: {
          fontFamily: 'Alegreya, Open Sans, sans-serif',
          // ...
        },
      }),
    [mode],
  );

  // cart processing
  const [cart, setCart] = usePersistentState("RHArt-cart", Array(0));

  // Add an item to the cart and save to local storage
  // preprocess cart (calculate/set quantity for each item)
  // if item is not in the cart already, add attribute "quantity" and set to 1, else increment the quantity
  const handleAddToCart = (item) => {
    const itemIndex = cart.findIndex((cartItem) => {
      if (item.product_option && cartItem.product_option) {
        return cartItem.product_option.id === item.product_option.id;
      } else {
        return cartItem.id === item.id;
      }
    });
  
    if (itemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[itemIndex] = {
        ...updatedCart[itemIndex],
        quantity: updatedCart[itemIndex].quantity + 1,
      };
      setCart(updatedCart);
    } else {
      const itemWithQuantity = { ...item, quantity: 1 };
      setCart([...cart, itemWithQuantity]);
    }
  
    setIsCartAnimating(true);
  
    // reset the animation after 0.5 second
    setTimeout(() => {
      setIsCartAnimating(false);
    }, 500);
  };

  // Remove an item from cart and save to local storage
  const handleRemoveItem = (index) => {
    setCart(cart.slice(0, index).concat(cart.slice(index + 1)));
  }

  return (
    <Router>
      <ScrollToTop />
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Box sx={{ flex: 1 }}>
              <Header
                cartCount={cart.reduce((total, item) => total + item.quantity, 0)}
                ColorModeContext={ColorModeContext}
                isCartAnimating={isCartAnimating}
              />

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/search" element={<Search />} />
                <Route path="/products/:id" element={
                  <Product
                    handleAddToCart={handleAddToCart}
                  />} 
                />
                <Route path="/about" element={<About />} />
                <Route path="/checkout" element={
                  <Checkout
                    cart={cart}
                    setCart={setCart}
                    handleRemoveItem={handleRemoveItem}
                    mode={mode}
                  />}
                />
                <Route path="/contact" element={<Contact />} />
                <Route path="/payment-complete" element={<PaymentComplete />} />
                <Route path="*" element={<NoMatch />} />
              </Routes>
            </Box>
            
            <Footer />
          </Box>

        </ThemeProvider>
      </ColorModeContext.Provider>
    </Router>
  );
}

export default App;
