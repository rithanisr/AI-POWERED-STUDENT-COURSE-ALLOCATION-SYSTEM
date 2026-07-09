import React, { useEffect, useState } from "react";
import {
  Alert,
  AppBar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Snackbar,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import GroupsIcon from "@mui/icons-material/Groups";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import api from "../api/api";
import Sidebar, { drawerWidth } from "../components/Sidebar";

const initialSummary = {
  totalStudents: 0,
  totalCourses: 0,
  allocatedStudents: 0,
  remainingSeats: 0,
};

const summaryCards = [
  {
    key: "totalStudents",
    title: "Total Students",
    icon: <GroupsIcon />,
    color: "#1565c0",
    backgroundColor: "#e3f2fd",
  },
  {
    key: "totalCourses",
    title: "Total Courses",
    icon: <SchoolIcon />,
    color: "#2e7d32",
    backgroundColor: "#e8f5e9",
  },
  {
    key: "allocatedStudents",
    title: "Allocated Students",
    icon: <AssignmentTurnedInIcon />,
    color: "#6a1b9a",
    backgroundColor: "#f3e5f5",
  },
  {
    key: "remainingSeats",
    title: "Remaining Seats",
    icon: <EventSeatIcon />,
    color: "#ef6c00",
    backgroundColor: "#fff3e0",
  },
];

const Dashboard = () => {
  const [summary, setSummary] = useState(initialSummary);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          studentsResponse,
          coursesResponse,
          allocatedResponse,
          seatsResponse,
        ] = await Promise.all([
          api.get("/dashboard/total-students"),
          api.get("/courses"),
          api.get("/dashboard/allocated-students"),
          api.get("/dashboard/available-seats"),
        ]);

        const availableCourses = seatsResponse.data?.courses || [];
        const remainingSeats = availableCourses.reduce(
          (total, course) => total + Number(course.totalRemainingSeats || 0),
          0,
        );

        setSummary({
          totalStudents: studentsResponse.data?.totalStudents || 0,
          totalCourses:
            coursesResponse.data?.count || coursesResponse.data?.data?.length || 0,
          allocatedStudents: allocatedResponse.data?.allocatedStudents || 0,
          remainingSeats,
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message:
            error.response?.data?.message ||
            "Unable to load dashboard summary.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "#f5f7fb"}}>
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
              Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 },  px:{xs:3,md:6}}}>
          <Stack spacing={1} sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                color: "#1565c0",
                fontWeight: 700,
                fontSize: { xs: "1.75rem", sm: "2.125rem" },
              }}
            >
              Dashboard
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Overview of students, courses, allocation status, and available
              seats.
            </Typography>
          </Stack>

          {loading ? (
            <Stack alignItems="center" spacing={2} sx={{ py: 6 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Loading dashboard summary...
              </Typography>
            </Stack>
          ) : (
            <Grid container spacing={6}>
              {summaryCards.map((card) => (
                <Grid item xs={12} sm={8} lg={4} key={card.key}>
                  <Card
                    elevation={2}
                    sx={{
                      height: "100%",
                      borderRadius: 2,
                    }}
                  >
                    <CardContent>
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary", mb: 1 }}
                          >
                            {card.title}
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            {summary[card.key]}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            width: 54,
                            height: 54,
                            borderRadius: 2,
                            display: "grid",
                            placeItems: "center",
                            color: card.color,
                            bgcolor: card.backgroundColor,
                            "& svg": {
                              fontSize: 30,
                            },
                          }}
                        >
                          {card.icon}
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
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
          severity="error"
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

export default Dashboard;
