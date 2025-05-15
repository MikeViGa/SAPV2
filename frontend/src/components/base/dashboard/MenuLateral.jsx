import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import { styled } from '@mui/material/styles';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuComponent from './MenuComponent';
import { obtenerModulosPermitidosApi } from '../../api/ModuloApiService';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { useTheme } from '@mui/material/styles';

export default function MenuLateral({ menuLateral, manejaMenuLateral }) {

  const [submenuOpen, setSubmenuOpen] = useState({});
  const [subSubmenuOpen, setSubSubmenuOpen] = useState({});
  const [drawerWidth, setDrawerWidth] = useState(200);
  const [open, setOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [margenIzquierdoAppBar, setMargenIzquierdoAppBar] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState(null);
  const [menuItems, setMenuItems] = useState([]); // Initialize as empty array
  const [openState, setOpenState] = useState({});
  const [selected, setSelected] = useState(null);
  const [allExpanded, setAllExpanded] = useState(false);
  const theme = useTheme();

  const toggleAll = () => {
    const newExpandState = !allExpanded;
    const newOpenState = {};

    const processItems = (items, parentIndex = '') => {
      items.forEach((item, index) => {
        const currentIndex = parentIndex ? `${parentIndex}-${index}` : `${index}`;
        if (item.submenus && item.submenus.length > 0) {
          newOpenState[currentIndex] = newExpandState;
          processItems(item.submenus, currentIndex);
        }
      });
    };

    processItems(menuItems);
    setOpenState(newOpenState);
    setAllExpanded(newExpandState);
  };

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const collapseAll = () => {
    setSubmenuOpen({});
    setSubSubmenuOpen({});
    setOpen(false);
  };

  const handleMouseLeave = () => {
    collapseAll();
    setOpen(false);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
    setOpen(!open);
    if (open) {
      if (allExpanded)
        toggleAll();
      setMargenIzquierdoAppBar(0);
    } else {
      setMargenIzquierdoAppBar(300);
    }
  };

  const handleClick = (index) => {
    setOpenState(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  });

  const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 10px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(8)} - 15px)`,
    },
  });

  const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      }),
      ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      }),
    }),
  );

  const buildMenuHierarchy = (flatMenu) => {
    if (!Array.isArray(flatMenu)) return [];
    const menuMap = {};
    const rootItems = [];

    flatMenu.forEach(item => {
      if (item && item.id) {
        menuMap[item.id] = { ...item, submenus: [] };
      }
    });

    flatMenu.forEach(item => {
      if (item && item.superModulo && item.superModulo.id) {
        const parent = menuMap[item.superModulo.id];
        if (parent) {
          parent.submenus.push(menuMap[item.id]);
        }
      } else if (item && item.id) {
        rootItems.push(menuMap[item.id]);
      }
    });
    return rootItems;
  };

  const obtenerMenu = async () => {
    try {
      const response = await obtenerModulosPermitidosApi(sessionStorage.getItem('nombreUsuario'));
      if (response && response.data) {
        const hierarchy = buildMenuHierarchy(response.data);
        setMenuItems(hierarchy || []);
      } else {
        setMenuItems([]);
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
      setMenuItems([]);
    }
  }

  useEffect(() => {
    obtenerMenu();
  }, []);

  return (
    <>
      <Drawer
        variant="permanent"
        open={open}
        onClose={toggleDrawer}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
            border: 0,
          }}
        >
          <IconButton onClick={toggleDrawer}>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Toolbar>
        <Box sx={{ overflow: 'auto', overflowX: 'hidden', border: 0 }}
        //onMouseEnter={handleMouseEnter}
        // onMouseLeave={handleMouseLeave}
        >
          <MenuComponent
            menuItems={menuItems}
            openState={openState}
            handleClick={handleClick}
            selected={selected}
            setSelected={setSelected}
            allExpanded={allExpanded}
            toggleAll={toggleAll}
            open={open}
            toggleDrawer={toggleDrawer}
          />
        </Box>
      </Drawer>
    </>
  );
}