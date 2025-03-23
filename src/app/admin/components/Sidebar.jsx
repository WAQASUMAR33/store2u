'use client';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// MUI Imports
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Divider,
} from '@mui/material';
import {
  Home as HomeIcon,
  People as PeopleIcon,
  ExitToApp as ExitToAppIcon,
  ExpandMore as ExpandMoreIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Tag as TagIcon,
  Brush as BrushIcon,
  Straighten as StraightenIcon,
  Settings as SettingsIcon,
  LocalOffer as LocalOfferIcon,
  Image as ImageIcon,
  Star as StarIcon,
  Article as ArticleIcon,
  Phone as PhoneIcon,
  Store as StoreIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';

const Sidebar = ({ setActiveComponent }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState({
    customers: false,
    products: false,
    orders: false,
    categories: false,
    size: false,
    color: false,
    settings: false,
    coupons: false,
    sliders: false,
    socialmedia: false,
    blog: false,
    reviews: false,
    pages: false,
  });

  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token') || localStorage.getItem('token');
    if (!token) {
      router.push('/admin');
    }
  }, [router]);

  const toggleDropdown = (key) => {
    setIsDropdownOpen((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/admin';
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 250,
          boxSizing: 'border-box',
          bgcolor: '#374151',
          color: 'white',
          height: '100vh',
          overflowY: 'auto',
        },
      }}
    >
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Image
          width={100}
          height={100}
          src="/store2ulogo.png"
          alt="Profile"
          style={{ borderRadius: '2px', padding: '8px', margin: '0 auto', backgroundColor: 'white' }}
        />
        <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold', fontSize: '1.1rem' }}>
          Store2u
        </Typography>
        <Typography variant="body2" sx={{ color: '#4ade80', fontSize: '0.8rem' }}>
          ● Online
        </Typography>
      </Box>

      <Divider sx={{ bgcolor: '#4b5563' }} />

      <List sx={{ p: 2 }}>
        {/* Home */}
        <ListItem disablePadding>
          <ListItemButton component="a" href="/admin/pages/Main">
            <ListItemIcon sx={{ color: 'white', minWidth: '32px' }}>
              <HomeIcon sx={{ fontSize: '1.2rem' }} />
            </ListItemIcon>
            <ListItemText primary="Home" primaryTypographyProps={{ fontSize: '0.9rem' }} />
          </ListItemButton>
        </ListItem>

        {/* Customers Data */}
        <Accordion sx={{ bgcolor: 'transparent', color: 'white', boxShadow: 'none' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: 'white', fontSize: '1.2rem' }} />}
            onClick={() => toggleDropdown('customers')}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: '32px', mr: 0 }}>
              <PeopleIcon sx={{ fontSize: '1.2rem' }} />
            </ListItemIcon>
            <Typography sx={{ fontSize: '0.9rem' }}>Customers</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem disablePadding>
                <ListItemButton component="a" href="/admin/pages/customer">
                  <ListItemText primary="Customers" sx={{ pl: 4 }} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Products */}
        <Accordion sx={{ bgcolor: 'transparent', color: 'white', boxShadow: 'none' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: 'white', fontSize: '1.2rem' }} />}
            onClick={() => toggleDropdown('products')}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: '32px', mr: 0 }}>
              <InventoryIcon sx={{ fontSize: '1.2rem' }} />
            </ListItemIcon>
            <Typography sx={{ fontSize: '0.9rem' }}>Products</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem disablePadding>
                <ListItemButton component="a" href="/admin/pages/Products">
                  <ListItemText primary="All Products" sx={{ pl: 4 }} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component="a" href="/admin/pages/add-product">
                  <ListItemText primary="Add Products" sx={{ pl: 4 }} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Orders */}
        <Accordion sx={{ bgcolor: 'transparent', color: 'white', boxShadow: 'none' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: 'white', fontSize: '1.2rem' }} />}
            onClick={() => toggleDropdown('orders')}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: '32px', mr: 0 }}>
              <ShoppingCartIcon sx={{ fontSize: '1.2rem' }} />
            </ListItemIcon>
            <Typography sx={{ fontSize: '0.9rem' }}>Orders</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem disablePadding>
                <ListItemButton component="a" href="/admin/pages/orders">
                  <ListItemText primary="View Orders" sx={{ pl: 4 }} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Categories */}
        <Accordion sx={{ bgcolor: 'transparent', color: 'white', boxShadow: 'none' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: 'white', fontSize: '1.2rem' }} />}
            onClick={() => toggleDropdown('categories')}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: '32px', mr: 0 }}>
              <TagIcon sx={{ fontSize: '1.2rem' }} />
            </ListItemIcon>
            <Typography sx={{ fontSize: '0.9rem' }}>Categories</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem disablePadding>
                <ListItemButton component="a" href="/admin/pages/categories">
                  <ListItemText primary="Categories" sx={{ pl: 4 }} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component="a" href="/admin/pages/subcategories">
                  <ListItemText primary="SubCategory" sx={{ pl: 4 }} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Size */}
        <Accordion sx={{ bgcolor: 'transparent', color: 'white', boxShadow: 'none' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: 'white', fontSize: '1.2rem' }} />}
            onClick={() => toggleDropdown('size')}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: '32px', mr: 0 }}>
              <StraightenIcon sx={{ fontSize: '1.2rem' }} />
            </ListItemIcon>
            <Typography sx={{ fontSize: '0.9rem' }}>Size</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem disablePadding>
                <ListItemButton component="a" href="/admin/pages/size">
                  <ListItemText primary="Sizes" sx={{ pl: 4 }} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Color */}
        <Accordion sx={{ bgcolor: 'transparent', color: 'white', boxShadow: 'none' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: 'white', fontSize: '1.2rem' }} />}
            onClick={() => toggleDropdown('color')}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: '32px', mr: 0 }}>
              <BrushIcon sx={{ fontSize: '1.2rem' }} />
            </ListItemIcon>
            <Typography sx={{ fontSize: '0.9rem' }}>Color</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem disablePadding>
                <ListItemButton component="a" href="/admin/pages/color">
                  <ListItemText primary="Colors" sx={{ pl: 4 }} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Settings */}
        <Accordion sx={{ bgcolor: 'transparent', color: 'white', boxShadow: 'none' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: 'white', fontSize: '1.2rem' }} />}
            onClick={() => toggleDropdown('settings')}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: '32px', mr: 0 }}>
              <SettingsIcon sx={{ fontSize: '1.2rem' }} />
            </ListItemIcon>
            <Typography sx={{ fontSize: '0.9rem' }}>Settings</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem disablePadding>
                <ListItemButton component="a" href="/admin/pages/settings">
                  <ListItemText primary="Settings" sx={{ pl: 4 }} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component="a" href="/admin/pages/facebook-pixel">
                  <ListItemText primary="Facebook Pixel" sx={{ pl: 4 }} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Coupons */}
        <Accordion sx={{ bgcolor: 'transparent', color: 'white', boxShadow: 'none' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: 'white', fontSize: '1.2rem' }} />}
            onClick={() => toggleDropdown('coupons')}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: '32px', mr: 0 }}>
              <LocalOfferIcon sx={{ fontSize: '1.2rem' }} />
            </ListItemIcon>
            <Typography sx={{ fontSize: '0.9rem' }}>Coupons</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem disablePadding>
                <ListItemButton component="a" href="/admin/pages/coupons">
                  <ListItemText primary="Coupons" sx={{ pl: 4 }} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Sliders */}
        <Accordion sx={{ bgcolor: 'transparent', color: 'white', boxShadow: 'none' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: 'white', fontSize: '1.2rem' }} />}
            onClick={() => toggleDropdown('sliders')}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: '32px', mr: 0 }}>
              <ImageIcon sx={{ fontSize: '1.2rem' }} />
            </ListItemIcon>
            <Typography sx={{ fontSize: '0.9rem' }}>Slider</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem disablePadding>
                <ListItemButton component="a" href="/admin/pages/slider">
                  <ListItemText primary="View Sliders" sx={{ pl: 4 }} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Social Media */}
        <Accordion sx={{ bgcolor: 'transparent', color: 'white', boxShadow: 'none' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: 'white', fontSize: '1.2rem' }} />}
            onClick={() => toggleDropdown('socialmedia')}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: '32px', mr: 0 }}>
              <PeopleIcon sx={{ fontSize: '1.2rem' }} />
            </ListItemIcon>
            <Typography sx={{ fontSize: '0.9rem' }}>Social Media</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem disablePadding>
                <ListItemButton component="a" href="/admin/pages/socialmedia">
                  <ListItemText primary="Manage Social Media" sx={{ pl: 4 }} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Blog */}
        <Accordion sx={{ bgcolor: 'transparent', color: 'white', boxShadow: 'none' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: 'white', fontSize: '1.2rem' }} />}
            onClick={() => toggleDropdown('blog')}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: '32px', mr: 0 }}>
              <ArticleIcon sx={{ fontSize: '1.2rem' }} />
            </ListItemIcon>
            <Typography sx={{ fontSize: '0.9rem' }}>Blog</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem disablePadding>
                <ListItemButton component="a" href="/admin/pages/Blogs">
                  <ListItemText primary="Add Blog" sx={{ pl: 4 }} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component="a" href="/admin/pages/BlogCategory">
                  <ListItemText primary="Blog Categories" sx={{ pl: 4 }} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Customer Reviews */}
        <Accordion sx={{ bgcolor: 'transparent', color: 'white', boxShadow: 'none' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: 'white', fontSize: '1.2rem' }} />}
            onClick={() => toggleDropdown('reviews')}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: '32px', mr: 0 }}>
              <StarIcon sx={{ fontSize: '1.2rem' }} />
            </ListItemIcon>
            <Typography sx={{ fontSize: '0.9rem' }}>Customer Reviews</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem disablePadding>
                <ListItemButton component="a" href="/admin/pages/reviews">
                  <ListItemText primary="View Reviews" sx={{ pl: 4 }} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Pages */}
        <Accordion sx={{ bgcolor: 'transparent', color: 'white', boxShadow: 'none' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: 'white', fontSize: '1.2rem' }} />}
            onClick={() => toggleDropdown('pages')}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: '32px', mr: 0 }}>
              <DescriptionIcon sx={{ fontSize: '1.2rem' }} />
            </ListItemIcon>
            <Typography sx={{ fontSize: '0.9rem' }}>Pages</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem disablePadding>
                <ListItemButton component="a" href="/admin/pages/addPrivacyPolicy">
                  <ListItemText primary="Privacy Policy" sx={{ pl: 4 }} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component="a" href="/admin/pages/addTermsAndConditions">
                  <ListItemText primary="Terms & Conditions" sx={{ pl: 4 }} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component="a" href="/admin/pages/addShippingPolicy">
                  <ListItemText primary="Shipping Policy" sx={{ pl: 4 }} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component="a" href="/admin/pages/addReturnAndExchangePolicy">
                  <ListItemText primary="Return & Exchange Policy" sx={{ pl: 4 }} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component="a" href="/admin/pages/addAboutUs">
                  <ListItemText primary="About Us" sx={{ pl: 4 }} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component="a" href="/admin/pages/addContactUs">
                  <ListItemText primary="Contact Us" sx={{ pl: 4 }} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* FAQs */}
        <ListItem disablePadding>
          <ListItemButton component="a" href="/admin/pages/addFAQ">
            <ListItemIcon sx={{ color: 'white', minWidth: '32px' }}>
              <PeopleIcon sx={{ fontSize: '1.2rem' }} />
            </ListItemIcon>
            <ListItemText primary="FAQs" primaryTypographyProps={{ fontSize: '0.9rem' }} />
          </ListItemButton>
        </ListItem>

        {/* Contact Info */}
        <ListItem disablePadding>
          <ListItemButton component="a" href="/admin/pages/addContactInfo">
            <ListItemIcon sx={{ color: 'white', minWidth: '32px' }}>
              <PhoneIcon sx={{ fontSize: '1.2rem' }} />
            </ListItemIcon>
            <ListItemText primary="Contact Info" primaryTypographyProps={{ fontSize: '0.9rem' }} />
          </ListItemButton>
        </ListItem>

        {/* Company Details */}
        <ListItem disablePadding>
          <ListItemButton component="a" href="/admin/pages/CompanyDetails">
            <ListItemIcon sx={{ color: 'white', minWidth: '32px' }}>
              <StoreIcon sx={{ fontSize: '1.2rem' }} />
            </ListItemIcon>
            <ListItemText primary="Company Details" primaryTypographyProps={{ fontSize: '0.9rem' }} />
          </ListItemButton>
        </ListItem>

        {/* Logout */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon sx={{ color: 'white', minWidth: '32px' }}>
              <ExitToAppIcon sx={{ fontSize: '1.2rem' }} />
            </ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.9rem' }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;