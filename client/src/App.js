import { useMemo, createContext } from 'react';
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

const ColorModeContext = createContext({ toggleColorMode: () => {} });

function App() {
  const systemMode = useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light';
  const [mode, setMode] = usePersistentState("RHArt-darkmode", systemMode);

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

  const [cart, setCart] = usePersistentState("RHArt-cart", Array(0));

  // Add an item to the cart and save to local storage
  const handleAddToCart = (item) => {
    setCart([...cart, item]);
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
                cartCount={cart.length}
                ColorModeContext={ColorModeContext}
              />

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/search" element={<Search />} />
                <Route path="/products/:id" element={<Product handleAddToCart={handleAddToCart}/>} />
                <Route path="/about" element={<About />} />
                <Route path="/checkout" element={<Checkout cart={cart}/>} />
                <Route path="/contact" element={<Contact />} />
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
