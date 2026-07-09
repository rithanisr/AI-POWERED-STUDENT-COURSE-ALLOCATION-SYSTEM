import React from "react";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const getPreferenceLabel = (value) => {
  if (!value) {
    return "-";
  }

  return `Preference ${value}`;
};

const AllocationTable = ({ allocations = [], loading = false }) => {
  const rows = allocations.map((allocation, index) => ({
    id: allocation._id || allocation.studentId || index,
    studentId: allocation.studentId || "-",
    studentName: allocation.studentName || "-",
    allocatedCourse:
      allocation.allocatedCourseName || allocation.courseName || "Not Allocated",
    preference: allocation.allocatedPreference || allocation.preference || null,
    status:
      allocation.allocationStatus || allocation.status || "Not Allocated",
  }));

  const columns = [
    {
      field: "studentId",
      headerName: "Student ID",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "studentName",
      headerName: "Student Name",
      minWidth: 190,
      flex: 1.2,
    },
    {
      field: "allocatedCourse",
      headerName: "Allocated Course",
      minWidth: 210,
      flex: 1.4,
    },
    {
      field: "preference",
      headerName: "Preference",
      minWidth: 140,
      flex: 0.8,
      renderCell: (params) => getPreferenceLabel(params.value),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.8,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === "Allocated" ? "success" : "warning"}
          variant="outlined"
        />
      ),
    },
  ];

  return (
    <Box sx={{ height: { xs: 520, md: 620 }, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 25]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        slots={{
          noRowsOverlay: () => (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ height: "100%" }}
            >
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Run allocation to display allocated students.
              </Typography>
            </Stack>
          ),
        }}
        sx={{
          border: 0,
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f5f7fb",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 700,
          },
        }}
      />
    </Box>
  );
};

export default AllocationTable;
