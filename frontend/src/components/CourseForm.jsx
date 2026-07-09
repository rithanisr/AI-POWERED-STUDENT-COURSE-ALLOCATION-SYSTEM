import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";

const initialFormData = {
  courseName: "",
  totalSeats: "",
  reservedSeats: {
    General: "",
    OBC: "",
    SC: "",
    ST: "",
  },
};

const CourseForm = ({ open, course, onClose, onSubmit, submitting = false }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (course) {
      setFormData({
        courseName: course.courseName || "",
        totalSeats: course.totalSeats ?? "",
        reservedSeats: {
          General: course.reservedSeats?.General ?? "",
          OBC: course.reservedSeats?.OBC ?? "",
          SC: course.reservedSeats?.SC ?? "",
          ST: course.reservedSeats?.ST ?? "",
        },
      });
    } else {
      setFormData(initialFormData);
    }

    setErrors({});
  }, [course, open]);

  const validateForm = () => {
    const nextErrors = {};
    const totalSeats = Number(formData.totalSeats);
    const reservedTotal = Object.values(formData.reservedSeats).reduce(
      (total, value) => total + Number(value || 0),
      0,
    );

    if (!formData.courseName.trim()) {
      nextErrors.courseName = "Course name is required";
    }

    if (formData.totalSeats === "") {
      nextErrors.totalSeats = "Total seats are required";
    } else if (!Number.isInteger(totalSeats) || totalSeats <= 0) {
      nextErrors.totalSeats = "Total seats must be a positive number";
    }

    Object.entries(formData.reservedSeats).forEach(([category, value]) => {
      const numericValue = Number(value || 0);

      if (value === "") {
        nextErrors[category] = `${category} seats are required`;
      } else if (!Number.isInteger(numericValue) || numericValue < 0) {
        nextErrors[category] = "Seats cannot be negative";
      }
    });

    if (totalSeats > 0 && reservedTotal > totalSeats) {
      nextErrors.totalSeats = "Reserved seats cannot exceed total seats";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({ ...previous, [name]: "" }));
  };

  const handleReservedSeatChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      reservedSeats: {
        ...previous.reservedSeats,
        [name]: value,
      },
    }));

    setErrors((previous) => ({ ...previous, [name]: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      courseName: formData.courseName.trim(),
      totalSeats: Number(formData.totalSeats),
      reservedSeats: {
        General: Number(formData.reservedSeats.General),
        OBC: Number(formData.reservedSeats.OBC),
        SC: Number(formData.reservedSeats.SC),
        ST: Number(formData.reservedSeats.ST),
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {course ? "Edit Course" : "Add Course"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              required
              name="courseName"
              label="Course Name"
              value={formData.courseName}
              onChange={handleChange}
              error={Boolean(errors.courseName)}
              helperText={errors.courseName}
            />

            <TextField
              fullWidth
              required
              type="number"
              name="totalSeats"
              label="Total Seats"
              value={formData.totalSeats}
              onChange={handleChange}
              error={Boolean(errors.totalSeats)}
              helperText={errors.totalSeats}
              inputProps={{ min: 1 }}
            />

            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              }}
            >
              {["General", "OBC", "SC", "ST"].map((category) => (
                <Box key={category}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    name={category}
                    label={`${category} Reserved Seats`}
                    value={formData.reservedSeats[category]}
                    onChange={handleReservedSeatChange}
                    error={Boolean(errors[category])}
                    helperText={errors[category]}
                    inputProps={{ min: 0 }}
                  />
                </Box>
              ))}
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? "Saving..." : "Save Course"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CourseForm;
