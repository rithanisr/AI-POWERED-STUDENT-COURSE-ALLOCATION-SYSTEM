import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import LogoutIcon from "@mui/icons-material/Logout";

import { useAuth } from "../context/AuthContext";
import ConfirmationDialog from "./confirmationdialog"; // Update path if needed

const drawerWidth = 260;

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon />,
  },
  {
    label: "Courses",
    path: "/course-management",
    icon: <SchoolIcon />,
  },
  {
    label: "Student Allocation",
    path: "/student-allocation",
    icon: <AssignmentTurnedInIcon />,
  },
  {
    label: "AI Assistant",
    path: "/ai-assistant",
    icon: <SmartToyIcon />,
  },
];

const SidebarContent = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  // Open dialog
  const handleLogout = () => {
    setLogoutDialogOpen(true);
  };

  // Confirm logout
  const handleConfirm = () => {
    logout();
    setLogoutDialogOpen(false);

    if (onNavigate) {
      onNavigate();
    }

    navigate("/admin-login");
  };

  // Cancel logout
  const handleCancel = () => {
    setLogoutDialogOpen(false);
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1565c0" }}>
            Admin Panel
          </Typography>

          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            AI Allocation System
          </Typography>
        </Box>
      </Toolbar>

      <Divider />

      <List sx={{ flex: 1, px: 1.5, py: 2 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            onClick={onNavigate}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              color: "text.secondary",
              "& .MuiListItemIcon-root": {
                color: "inherit",
                minWidth: 40,
              },
              "&.active": {
                backgroundColor: "#e3f2fd",
                color: "#1565c0",
                fontWeight: 700,
              },
              "&:hover": {
                backgroundColor: "#f0f7ff",
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Divider />

      <Box sx={{ p: 1.5 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 1,
            color: "#d32f2f",
            "& .MuiListItemIcon-root": {
              color: "inherit",
              minWidth: 40,
            },
            "&:hover": {
              backgroundColor: "#ffebee",
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>

          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>

      {/* Logout Confirmation Dialog */}
      <ConfirmationDialog
        open={logoutDialogOpen}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        confirmText="Yes, Logout"
        confirmColor="error"
        onClose={handleCancel}
        onConfirm={handleConfirm}
      />
    </Box>
  );
};

const Sidebar = ({ mobileOpen = false, onMobileClose }) => {
  return (
    <Box
      component="nav"
      sx={{
        width: { md: drawerWidth },
        flexShrink: { md: 0 },
      }}
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        <SidebarContent onNavigate={onMobileClose} />
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "1px solid #e0e0e0",
          },
        }}
      >
        <SidebarContent />
      </Drawer>
    </Box>
  );
};

export { drawerWidth };
export default Sidebar;