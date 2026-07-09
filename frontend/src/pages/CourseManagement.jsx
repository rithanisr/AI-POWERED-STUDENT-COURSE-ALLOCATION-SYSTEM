import React, { useEffect, useState } from "react";
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
import AddIcon from "@mui/icons-material/Add";
import api from "../api/api";
import Sidebar, { drawerWidth } from "../components/Sidebar";
import CourseForm from "../components/CourseForm";
import CourseTable from "../components/CourseTable";
import ConfirmationDialog from "../components/confirmationdialog";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [confirmation, setConfirmation] = useState({
    open: false,
    action: "",
    course: null,
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchCourses = async () => {
    setLoading(true);

    try {
      const response = await api.get("/courses");
      setCourses(response.data?.data || []);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Unable to load courses.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddCourse = () => {
    setSelectedCourse(null);
    setFormOpen(true);
  };

  const handleEditCourse = (course) => {
    setConfirmation({
      open: true,
      action: "edit",
      course,
    });
  };

  const handleCloseConfirmation = () => {
    if (submitting) {
      return;
    }

    setConfirmation({
      open: false,
      action: "",
      course: null,
    });
  };

  const handleCloseForm = () => {
    if (submitting) {
      return;
    }

    setFormOpen(false);
    setSelectedCourse(null);
  };

  const handleSubmitCourse = async (courseData) => {
    setSubmitting(true);

    try {
      if (selectedCourse) {
        await api.put(`/courses/${selectedCourse._id}`, courseData);
        setSnackbar({
          open: true,
          message: "Course updated successfully.",
          severity: "success",
        });
      } else {
        await api.post("/courses", courseData);
        setSnackbar({
          open: true,
          message: "Course added successfully.",
          severity: "success",
        });
      }

      setFormOpen(false);
      setSelectedCourse(null);
      await fetchCourses();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Unable to save course.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = (course) => {
    setConfirmation({
      open: true,
      action: "delete",
      course,
    });
  };

  const handleConfirmAction = async () => {
    const { action, course } = confirmation;

    if (!course) {
      return;
    }

    if (action === "edit") {
      setSelectedCourse(course);
      setFormOpen(true);
      handleCloseConfirmation();
      return;
    }

    if (action === "delete") {
      setSubmitting(true);

      try {
        await api.delete(`/courses/${course._id}`);
        setSnackbar({
          open: true,
          message: "Course deleted successfully.",
          severity: "success",
        });
        handleCloseConfirmation();
        await fetchCourses();
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Unable to delete course.",
          severity: "error",
        });
      } finally {
        setSubmitting(false);
      }
    }
  };

  const confirmationTitle =
    confirmation.action === "delete" ? "Delete Course" : "Edit Course";
  const confirmationMessage =
    confirmation.action === "delete"
      ? `Are you sure you want to delete ${confirmation.course?.courseName || "this course"}? This action cannot be undone.`
      : `Do you want to edit ${confirmation.course?.courseName || "this course"}?`;
  const confirmationText =
    confirmation.action === "delete" ? "Delete" : "Edit";
  const confirmationColor =
    confirmation.action === "delete" ? "error" : "primary";

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
              Courses
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 },  px:{xs:3,md:6} }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={2}
            sx={{ mb: 3, justifyContent: "space-between" }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  color: "#1565c0",
                  fontWeight: 700,
                  fontSize: { xs: "1.6rem", sm: "2.125rem" },
                }}
              >
                Course Management
              </Typography>

              <Typography variant="body1" color="text.secondary">
                Add, edit, and delete courses with category-wise reserved seats.
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddCourse}
              sx={{
                textTransform: "none",
                minWidth: 160,
                alignSelf: { xs: "flex-start", sm: "center" }, // Moves left on mobile
              }}
            >
              Add Course
            </Button>
          </Stack>

          <Paper
            elevation={2}
            sx={{
              p: { xs: 1, sm: 2 },
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <CourseTable
              courses={courses}
              loading={loading}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
            />
          </Paper>
        </Container>
      </Box>

      <CourseForm
        open={formOpen}
        course={selectedCourse}
        onClose={handleCloseForm}
        onSubmit={handleSubmitCourse}
        submitting={submitting}
      />

      <ConfirmationDialog
        open={confirmation.open}
        title={confirmationTitle}
        message={confirmationMessage}
        confirmText={confirmationText}
        confirmColor={confirmationColor}
        loading={submitting && confirmation.action === "delete"}
        onClose={handleCloseConfirmation}
        onConfirm={handleConfirmAction}
      />

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

export default CourseManagement;
