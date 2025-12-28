import { useContext, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Movie as MovieIcon,
  Search as SearchIcon,
  Dashboard as DashboardIcon,
  AccountCircle,
} from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "linear-gradient(90deg, #1a1a2e 0%, #16213e 100%)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        width: "100%",
      }}
    >
      <Box sx={{ width: "100%", px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
        <Toolbar disableGutters sx={{ py: 1 }}>
          {/* Logo */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "white",
              mr: 4,
              "&:hover": { opacity: 0.9 },
            }}
          >
            <MovieIcon sx={{ fontSize: 32, mr: 1 }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                letterSpacing: 1,
                display: { xs: "none", sm: "block" },
              }}
            >
              CineBase
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ flexGrow: 1, display: "flex", gap: 1 }}>
            <Button
              component={RouterLink}
              to="/"
              sx={{
                color: "white",
                fontWeight: 600,
                px: 2,
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              HOME
            </Button>
            <Button
              component={RouterLink}
              to="/search"
              startIcon={<SearchIcon />}
              sx={{
                color: "white",
                fontWeight: 600,
                px: 2,
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              SEARCH
            </Button>
            {isAdmin && (
              <Button
                component={RouterLink}
                to="/admin"
                startIcon={<DashboardIcon />}
                sx={{
                  color: "white",
                  fontWeight: 600,
                  px: 2,
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                ADMIN
              </Button>
            )}
          </Box>

          {/* User Menu or Login */}
          {user ? (
            <>
              <IconButton
                onClick={handleMenu}
                sx={{
                  color: "white",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <AccountCircle sx={{ fontSize: 32 }} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem disabled>
                  <Typography variant="caption" color="text.secondary">
                    {user.email}
                  </Typography>
                </MenuItem>
                <MenuItem disabled>
                  <Typography variant="caption" color="text.secondary">
                    Role: {user.role}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              disableElevation
              sx={{
                bgcolor: "#667eea",
                color: "#fff",
                fontWeight: 600,
                px: 3,
                textDecoration: "none",
                "&:hover": {
                  bgcolor: "#5568d3",
                  color: "#fff",
                },
              }}
            >
              LOGIN
            </Button>
          )}
        </Toolbar>
      </Box>
    </AppBar>
  );
};

export default Navbar;
