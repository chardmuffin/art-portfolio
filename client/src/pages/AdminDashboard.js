import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Breadcrumbs, Link, Button, Box, Card, CardHeader, CardContent, Drawer } from '@mui/material';
import { TreeView, TreeItem } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../utils/helpers';

import CreateCategory from '../components/Admin/CreateCategory';
import CreateOptionGroup from '../components/Admin/CreateOptionGroup';
import CreateProduct from '../components/Admin/CreateProduct';
import CategoriesTable from '../components/Admin/CategoriesTable';
import ProductTable from '../components/Admin/ProductTable';
import OptionsAndGroupsTable from '../components/Admin/OptionsAndGroupsTable';

const AdminDashboard = () => {
  const [selectedNode, setSelectedNode] = useState({ nodeId: '' });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const nodeIdToLabel = {
    categories: 'Categories',
    optionsAndGroups: 'Options & Groups',
    product: 'Product'
  };

  const nodes = [
    {
      nodeId: 'categories',
      newComponent: <CreateCategory />,
      content: <CategoriesTable />,
    },
    {
      nodeId: 'optionsAndGroups',
      newComponent: <CreateOptionGroup />,
      content: <OptionsAndGroupsTable />,
    },
    {
      nodeId: 'product',
      newComponent: <CreateProduct />,
      content: <ProductTable />,
    }
  ];

  useEffect(() => {
    !isLoggedIn() && navigate('/login');
  }, [navigate])

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const generateBreadcrumbs = () => {
    const breadcrumbs = [
      <Link key="dashboard" underline="hover" color="inherit" onClick={() => setSelectedNode({ nodeId: '' })}>
        Dashboard
      </Link>,
    ];
  
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
            <TreeItem nodeId="optionsAndGroups" label="Options & Groups" />
            <TreeItem nodeId="product" label="Product" />
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
        <Box role="presentation" sx={{ width: '100%', maxWidth: 400, p: 3 }} >
          {selectedNode.newComponent}
        </Box>
      </Drawer>

    </Container>
  );
};

export default AdminDashboard;