import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Breadcrumbs, Link, Button, Box, Card, CardHeader, CardContent, Drawer } from '@mui/material';
import { TreeView, TreeItem } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../utils/helpers';

import CreateCategory from '../components/Admin/CreateCategory';
import CreateOptionGroup from '../components/Admin/CreateOptionGroup';
import CreateOptions from '../components/Admin/CreateOptions';
import CreateProduct from '../components/Admin/CreateProduct';
import CreateProductWithOptions from '../components/Admin/CreateProductWithOptions';
import CategoriesTable from '../components/Admin/CategoriesTable';
import ProductOptionsTable from '../components/Admin/ProductOptionsTable';
import ProductsTable from '../components/Admin/ProductsTable';
import OptionsTable from '../components/Admin/OptionsTable';
import OptionGroupsTable from '../components/Admin/OptionGroupsTable';

const AdminDashboard = () => {
  const [selectedNode, setSelectedNode] = useState({ nodeId: '' });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const nodeIdToLabel = {
    categories: 'Categories',
    options: 'Options',
    optionGroups: 'Option Groups',
    products: 'Products',
    productWithOptions: 'Products (Incl. Options)',
    optionsAndOptionGroups: 'Options & Groups',
    productsAndProductOptions: 'Product'
  };

  const nodes = [
    {
      nodeId: 'categories',
      newComponent: <CreateCategory />,
      content: <CategoriesTable />,
    },
    {
      nodeId: 'options',
      newComponent: <CreateOptions />,
      content: <OptionsTable />,
    },
    {
      nodeId: 'optionGroups',
      newComponent: <CreateOptionGroup />,
      content: <OptionGroupsTable />,
    },
    {
      nodeId: 'products',
      newComponent: <CreateProduct />,
      content: <ProductsTable />,
    },
    {
      nodeId: 'productWithOptions',
      newComponent: <CreateProductWithOptions />,
      content: <ProductOptionsTable />,
    },
  ];

  useEffect(() => {
    !isLoggedIn() && navigate('/login');
  }, [navigate])

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const generateBreadcrumbs = () => {
    const parentNodes = {
      options: 'optionsAndOptionGroups',
      optionGroups: 'optionsAndOptionGroups',
      products: 'productsAndProductOptions',
      productWithOptions: 'productsAndProductOptions',
    };
  
    const parentNodeId = parentNodes[selectedNode.nodeId];
    const parentNodeLabel = nodeIdToLabel[parentNodeId];

    const breadcrumbs = [
      <Link key="dashboard" underline="hover" color="inherit" onClick={() => setSelectedNode({ nodeId: '' })}>
        Dashboard
      </Link>,
    ];

    if (parentNodeLabel) {
      breadcrumbs.push(
        <Link key={parentNodeId} underline="hover" color="inherit" onClick={(e) => handleNodeSelect(e, parentNodeId)}>
          {parentNodeLabel}
        </Link>,
      );
    }
  
    if (selectedNode.nodeId) {
      breadcrumbs.push(
        <Typography key={selectedNode.nodeId} color="text.primary">
          {nodeIdToLabel[selectedNode.nodeId]}
        </Typography>,
      );
    }

    return breadcrumbs;
  };

  const handleNodeSelect = (e, nodeId) => {
    const node = nodes.find((node) => node.nodeId === nodeId);
    if (node) {
      setSelectedNode(node);
    } else { // parent node
      setSelectedNode({ nodeId: nodeId });
    }
  };

  return (
    <Container component={'main'} sx={{ minWidth: '100%', m:0, p: 0 }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} sx={{ textAlign: 'center', my: 2 }}>
          <Typography variant="h5">Admin Dashboard</Typography>
          <Breadcrumbs>
            {generateBreadcrumbs()}
          </Breadcrumbs>
        </Grid>

        <Grid item xs={12} md={2}>
          <TreeView
            aria-label="treeview"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            selected={selectedNode.nodeId}
            onNodeSelect={(e, nodeId) => handleNodeSelect(e, nodeId)}
          >
            <TreeItem nodeId="categories" label="Categories" />
            <TreeItem nodeId="optionsAndOptionGroups" label="Options & Groups">
              <TreeItem nodeId="optionGroups" label="Option Groups" />
              <TreeItem nodeId="options" label="Options"/>  
            </TreeItem>
            <TreeItem nodeId="productsAndProductOptions" label="Product">
              <TreeItem nodeId="products" label="Products" />
              <TreeItem nodeId="productWithOptions" label="Products (Incl. Options)" />
            </TreeItem>
          </TreeView>
        </Grid>
        <Grid item xs={12} md={10}>
          <Card sx={{ boxShadow: 8, borderRadius: '4px' }}>
          <CardHeader
            title={
              <Box display="flex" alignItems="center">
                <Typography variant="h5">
                  {nodeIdToLabel[selectedNode.nodeId]}
                </Typography>
                {selectedNode.newComponent && (
                  <Box ml="auto">
                    <Button variant="outlined" onClick={toggleDrawer}>
                      <Typography variant='button' >New</Typography>
                    </Button>
                  </Box>
                )}
              </Box>
            }
            sx={{ pb: 0 }}
          />
            <CardContent>
              {selectedNode.content}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
        <Box
          sx={{ width: '100%', maxWidth: 400, p: 3 }}
          role="presentation"
          onClick={toggleDrawer}
          onKeyDown={toggleDrawer}
        >
          {selectedNode.newComponent}
        </Box>
      </Drawer>

    </Container>
  );
};

export default AdminDashboard;