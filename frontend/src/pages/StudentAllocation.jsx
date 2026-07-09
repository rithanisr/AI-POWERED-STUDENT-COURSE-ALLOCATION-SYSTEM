import React, { useState } from "react";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import api from "../api/api";
import Sidebar, { drawerWidth } from "../components/Sidebar";
import AllocationTable from "../components/AllocationTable";

const extractAllocationRows = (data) => {
  if (Array.isArray(data?.allocations)) {
    return data.allocations;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.allocatedStudentsData)) {
    return data.allocatedStudentsData;
  }

  if (Array.isArray(data?.allocatedStudentsList)) {
    return data.allocatedStudentsList;
  }

  return [];
};

const StudentAllocation = () => {
  const [allocations, setAllocations] = useState([]);
  const [summary, setSummary] = useState({
    totalStudents: 0,
    allocatedStudents: 0,
    notAllocatedStudents: 0,
  });
  const [running, setRunning] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleRunAllocation = async () => {
    setRunning(true);

    try {
      const response = await api.post("/allocation");
      const responseData = response.data || {};
      const allocationRows = extractAllocationRows(responseData);

      setAllocations(allocationRows);
      setSummary({
        totalStudents: responseData.totalStudents || allocationRows.length || 0,
        allocatedStudents:
          responseData.allocatedStudents ||
          allocationRows.filter(
            (item) =>
              (item.allocationStatus || item.status) === "Allocated",
          ).length ||
          0,
        notAllocatedStudents:
          responseData.notAllocatedStudents ||
          allocationRows.filter(
            (item) =>
              (item.allocationStatus || item.status) === "Not Allocated",
          ).length ||
          0,
      });

      setSnackbar({
        open: true,
        message: responseData.message || "Allocation completed successfully.",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          "Unable to run allocation. Please try again.",
        severity: "error",
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "#f5f7fb" }}>
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <Box
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            display: { xs: "block", md: "none" },
            bgcolor: "white",
            color: "text.primary",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Student Allocation
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 }, px:{xs:3,md:6} }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            
            alignItems={{ xs: "stretch", md: "center" }}
            sx={{ mb: 3 , justifyContent: "space-between" }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  color: "#1565c0",
                  fontWeight: 700,
                  fontSize: { xs: "1.75rem", sm: "2.125rem" },
                }}
              >
                Student Allocation
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Run course allocation and review allocated student results.
              </Typography>
            </Box>

         <Box>
             <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={handleRunAllocation}
              disabled={running}
               sx={{
                textTransform: "none",
                minWidth: 160,
                alignSelf: { xs: "flex-start", sm: "center" }, // Moves left on mobile
              }}
            >
              {running ? "Running Allocation..." : "Run Allocation"}
            </Button>
         </Box>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ mb: 3 }}
          >
            {[
              ["Total Students", summary.totalStudents],
              ["Allocated Students", summary.allocatedStudents],
              ["Not Allocated", summary.notAllocatedStudents],
            ].map(([label, value]) => (
              <Paper
                key={label}
                elevation={1}
                sx={{
                  flex: 1,
                  p: 2,
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {label}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {value}
                </Typography>
              </Paper>
            ))}
          </Stack>

          <Paper
            elevation={2}
            sx={{
              p: { xs: 1, sm: 2 },
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <AllocationTable allocations={allocations} loading={running} />
          </Paper>
        </Container>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar((previous) => ({ ...previous, open: false }))
        }
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() =>
            setSnackbar((previous) => ({ ...previous, open: false }))
          }
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentAllocation;
