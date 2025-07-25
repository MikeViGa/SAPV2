import React from 'react';
import { useState, useEffect } from 'react';
import { ListItemButton, Button, Box } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { Link } from 'react-router-dom';
import ListItemIcon from '@mui/material/ListItemIcon';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import List from '@mui/material/List';
import { styled } from '@mui/material/styles';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import BadgeIcon from '@mui/icons-material/Badge';
import KeyIcon from '@mui/icons-material/Key';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DnsIcon from '@mui/icons-material/Dns';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PersonIcon from '@mui/icons-material/Person';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShopIcon from '@mui/icons-material/Shop';
import ArticleIcon from '@mui/icons-material/Article';
import InboxIcon from '@mui/icons-material/Inbox';
import AtaudIcon from './elementos/AtaudIcon'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Tooltip from '@mui/material/Tooltip';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExploreIcon from '@mui/icons-material/Explore';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import DatasetIcon from '@mui/icons-material/Dataset';
import heartbeat from './imagenes/logoheartbeat.gif';

const CustomListItemButton = styled(ListItemButton)(({ theme }) => ({
  width: 'auto',
  minWidth: 'fit-content',
  padding: '3px', //Separacion entre cada elemento de la lista
  '& .MuiListItemIcon-root': {
    minWidth: '30px', //Separacion entre el icono y el texto
    marginRight: '0px',
    marginLeft: '17px', //Separacion entre el borde izquierdo y el icono
  },
}));

const iconMap = {
  PeopleIcon: <PeopleIcon />,
  FingerprintIcon: <FingerprintIcon />,
  ViewModuleIcon: <ViewModuleIcon />,
  PersonIcon: <PersonIcon />,
  BusinessIcon: <BusinessIcon />,
  BadgeIcon: <BadgeIcon />,
  KeyIcon: <KeyIcon />,
  SettingsIcon: <SettingsIcon />,
  AccountCircleIcon: <AccountCircleIcon />,
  DnsIcon: <DnsIcon />,
  TextSnippetIcon: <TextSnippetIcon />,
  HomeRepairServiceIcon: <HomeRepairServiceIcon />,
  SupervisorAccountIcon: <SupervisorAccountIcon />,
  InventoryIcon: <InventoryIcon />,
  ShopIcon: <ShopIcon />,
  ArticleIcon: <ArticleIcon />,
  InboxIcon: <InboxIcon />,
  AtaudIcon: <AtaudIcon />,
  FormatListNumberedIcon: <FormatListNumberedIcon />,
  AccountBalanceWalletIcon: <AccountBalanceWalletIcon />,
  ExploreIcon: <ExploreIcon />,
  AddLocationAltIcon: <AddLocationAltIcon />,
  DatasetIcon: <DatasetIcon />,
};

const renderMenuItems = (items, openState, handleClick, selected, setSelected, parentIndex = '', depth = 0) => {
  return items.map((item, index) => {
    const currentIndex = parentIndex ? `${parentIndex}-${index}` : `${index}`;
    const iconName = item.icono ? item.icono.replace(/<|\/>/g, '') : null;
    const IconComponent = iconName ? iconMap[iconName] : null;
    // Changed from item.submenus to item.subModulos
    const hasSubmenus = item.subModulos && item.subModulos.length > 0;

    return (
      <div key={`item-${currentIndex}`}>
        <CustomListItemButton
          component={Link}
          to={item.ruta}
          onClick={() => {
            // Changed from item.submenus to item.subModulos
            if (item.subModulos && item.subModulos.length > 0) handleClick(currentIndex);
            setSelected(currentIndex);
          }}
          style={{
            paddingLeft: 3 + depth * 10,
            backgroundColor: selected === currentIndex ? '#e7f1ff' : 'inherit',
          }}
        >
          <ListItemIcon sx={{
            minWidth: '36px',
            '& .MuiSvgIcon-root': {
              fontSize: '1.3rem' // Cambia el tamaño del icono
            }
          }} >
            {IconComponent}
          </ListItemIcon>
          <ListItemText
            primary={item.nombre}
            sx={{
              '& .MuiListItemText-primary': {
                fontSize: '.8rem',
                fontWeight: hasSubmenus ? 'bold' : 'normal'
              }
            }}
          />
          {hasSubmenus ? (openState[currentIndex] ? <ExpandLess /> : <ExpandMore />) : null}
        </CustomListItemButton>
        {/* Changed from item.submenus to item.subModulos */}
        {item.subModulos && item.subModulos.length > 0 && (
          <Collapse in={openState[currentIndex]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {/* Changed from item.submenus to item.subModulos */}
              {renderMenuItems(item.subModulos, openState, handleClick, selected, setSelected, currentIndex, depth + 1)}
            </List>
          </Collapse>
        )}
      </div>
    );
  });
};

export default function MenuComponent({ menuItems, openState, handleClick, selected, setSelected, allExpanded,
  toggleAll, open, toggleDrawer }) {

  if (!menuItems || menuItems.length === 0) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', px: 1, border:1, color: '#fff'}}>
      <img src={heartbeat} width={100}/>
      </Box>;
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1, backgroundColor: 'lightgrey' }}>
        <Tooltip title={open ? "Cerrar menú" : "Abrir menú"}>
          <Button
            onClick={toggleDrawer}
            startIcon={open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            size="small"
            sx={{ fontSize: '0.8rem' }}
          />
        </Tooltip>
        <Tooltip title={allExpanded ? "Contraer" : "Expandir"}>
          <Button
            onClick={toggleAll}
            startIcon={allExpanded ? <RemoveCircleOutlineIcon /> : <ControlPointIcon />}
            size="small"
            sx={{ fontSize: '0.8rem' }}
          />
        </Tooltip>
      </Box>
      <List>
        {renderMenuItems(menuItems, openState, handleClick, selected, setSelected)}
      </List>
    </>
  );
}