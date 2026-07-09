import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import api from "../api/api";
import Navbar from "../components/Navbar";

const initialFormData = {
  name: "",
  email: "",
  marks: "",
  category: "",
  applicationDate: new Date().toISOString().split("T")[0],
  preferredCourse1: "",
  preferredCourse2: "",
  preferredCourse3: "",
};

const categories = ["General", "OBC", "SC", "ST"];

const StudentApplication = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [courses, setCourses] = useState([]);
  const [errors, setErrors] = useState({});
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [emailVerification, setEmailVerification] = useState({
    verified: false,
    verifying: false,
    error: "",
    success: "",
  });

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await api.get("/courses");
        setCourses(response.data?.data || []);
      } catch (error) {
        setSnackbar({
          open: true,
          message:
            error.response?.data?.message ||
            "Unable to load courses. Please try again.",
          severity: "error",
        });
      } finally {
        setLoadingCourses(false);
      }
    };

    loadCourses();
  }, []);

  const selectedPreferences = useMemo(
    () => [
      formData.preferredCourse1,
      formData.preferredCourse2,
      formData.preferredCourse3,
    ],
    [formData],
  );

  const getCourseOptions = (currentValue) =>
    courses.filter(
      (course) =>
        course.courseId === currentValue ||
        !selectedPreferences.includes(course.courseId),
    );

  const validateForm = () => {
    const nextErrors = {};
    const marksValue = Number(formData.marks);
    const preferences = selectedPreferences.filter(Boolean);

    if (!formData.name.trim()) {
      nextErrors.name = "Student name is required";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      nextErrors.email = "Please enter a valid email address";
    }

    if (formData.marks === "") {
      nextErrors.marks = "Marks are required";
    } else if (Number.isNaN(marksValue) || marksValue < 0 || marksValue > 100) {
      nextErrors.marks = "Marks must be between 0 and 100";
    }

    if (!formData.category) {
      nextErrors.category = "Category is required";
    }

    if (!formData.applicationDate) {
      nextErrors.applicationDate = "Application date is required";
    }

    if (!formData.preferredCourse1) {
      nextErrors.preferredCourse1 = "Preferred Course 1 is required";
    }

    if (!formData.preferredCourse2) {
      nextErrors.preferredCourse2 = "Preferred Course 2 is required";
    }

    if (!formData.preferredCourse3) {
      nextErrors.preferredCourse3 = "Preferred Course 3 is required";
    }

    if (new Set(preferences).size !== preferences.length) {
      nextErrors.preferredCourse1 = "Course preferences must be unique";
      nextErrors.preferredCourse2 = "Course preferences must be unique";
      nextErrors.preferredCourse3 = "Course preferences must be unique";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0 && emailVerification.verified;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    if (name === "email") {
      setEmailVerification({
        verified: false,
        verifying: false,
        error: "",
        success: "",
      });
    }
  };

  const handleVerifyEmail = async () => {
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email." }));
      return;
    }

    setEmailVerification({ ...emailVerification, verifying: true, error: "", success: "" });

    try {
      const response = await api.post("/students/verify-email", {
        email: formData.email,
      });
      setEmailVerification({
        verified: true,
        verifying: false,
        success: response.data.message,
        error: "",
      });
    } catch (error) {
      const message = error.response?.data?.message || "Verification failed.";
      setEmailVerification({ verified: false, verifying: false, success: "", error: message });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      await api.post("/students", {
        name: formData.name.trim(),
        email: formData.email.toLowerCase(),
        marks: Number(formData.marks),
        category: formData.category,
        applicationDate: formData.applicationDate,
        preferences: selectedPreferences,
      });
       

      setSnackbar({
        open: true,
        message: "Application submitted successfully.",
        severity: "success",
        
      });

      setTimeout(() => {
        navigate("/");
      }, 2500);
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          "Unable to submit application. Please try again.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderCourseSelect = (name, label) => (
    <TextField
      select
      fullWidth
      required
      name={name}
      label={label}
      value={formData[name]}
      onChange={handleChange}
      error={Boolean(errors[name])}
      helperText={errors[name]}
      disabled={loadingCourses || courses.length === 0}
    >
      {getCourseOptions(formData[name]).map((course) => (
        <MenuItem key={course.courseId} value={course.courseId}>
          {course.courseName}
        </MenuItem>
      ))}
    </TextField>
  );

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f7fb" }}>
      <Navbar />

      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 2,
          }}
        >
          <Stack spacing={1} sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                color: "#1565c0",
                fontWeight: 700,
                fontSize: { xs: "1.75rem", sm: "2.125rem" },
              }}
            >
              Student Application
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Submit your course preferences for admission allocation.
            </Typography>
          </Stack>

          {loadingCourses ? (
            <Stack alignItems="center" spacing={2} sx={{ py: 8 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Loading available courses...
              </Typography>
            </Stack>
          ) : (
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Box
                sx={{
                  display: "grid",
                  gap: 3,
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                }}
              >
                <Box>
                  <TextField
                    fullWidth
                    required
                    name="name"
                    label="Student Name"
                    value={formData.name}
                    onChange={handleChange}
                    error={Boolean(errors.name)}
                    helperText={errors.name}
                  />
                </Box>

                <Box>
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <TextField
                      fullWidth
                      required
                      name="email"
                      label="Email"
                      value={formData.email}
                      onChange={handleChange}
                      error={Boolean(errors.email) || Boolean(emailVerification.error)}
                      helperText={errors.email || emailVerification.error}
                      disabled={emailVerification.verifying}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleVerifyEmail}
                      disabled={!formData.email || emailVerification.verified || emailVerification.verifying || Boolean(errors.email)}
                      sx={{ height: "56px", whiteSpace: "nowrap" }}
                    >
                      {emailVerification.verifying ? <CircularProgress size={24} /> : "Verify"}
                    </Button>
                  </Stack>
                  {emailVerification.success && (
                    <Typography variant="caption" color="success.main" sx={{ mt: 1, display: "block" }}>
                      ✓ {emailVerification.success}
                    </Typography>
                  )}
                </Box>

                <Box>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    name="marks"
                    label="Percentage"
                    value={formData.marks}
                    onChange={handleChange}
                    error={Boolean(errors.marks)}
                    helperText={errors.marks}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    }}
                    inputProps={{
                      min: 0,
                      max: 100,
                      step: "0.01",
                      onWheel: (e) => e.target.blur(),
                    }}
                  />
                </Box>

                <Box sx={{ gridColumn: "1 / -1" }}>
                  <TextField
                    select
                    fullWidth
                    required
                    name="category"
                    label="Category"
                    value={formData.category}
                    onChange={handleChange}
                    error={Boolean(errors.category)}
                    helperText={errors.category}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                <Box sx={{ gridColumn: "1 / -1" }}>
                  <TextField
                    fullWidth
                    required
                    type="date"
                    name="applicationDate"
                    label="Application Date"
                    value={formData.applicationDate}
                    onChange={handleChange}
                    error={Boolean(errors.applicationDate)}
                    helperText={errors.applicationDate}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>

                <Box sx={{ gridColumn: "1 / -1" }}>
                  {renderCourseSelect("preferredCourse1", "Preferred Course 1")}
                </Box>

                <Box sx={{ gridColumn: "1 / -1" }}>
                  {renderCourseSelect("preferredCourse2", "Preferred Course 2")}
                </Box>

                <Box sx={{ gridColumn: "1 / -1" }}>
                  {renderCourseSelect("preferredCourse3", "Preferred Course 3")}
                </Box>

                {courses.length === 0 && (
                  <Box sx={{ gridColumn: "1 / -1" }}>
                    <Alert severity="warning">
                      No courses are available right now. Please try again
                      later.
                    </Alert>
                  </Box>
                )}

                <Box sx={{ gridColumn: "1 / -1" }}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    justifyContent="flex-end"
                  >
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate("/")}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={
                        submitting ||
                        courses.length === 0 ||
                        !emailVerification.verified ||
                        Object.values(errors).some(Boolean)
                      }
                      sx={{ minWidth: 180 }}
                    >
                      {submitting ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
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

export default StudentApplication;
