import React from "react";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const CourseTable = ({ courses = [], loading = false, onEdit, onDelete }) => {
  const rows = courses.map((course) => ({
    id: course._id,
    courseId: course.courseId,
    courseName: course.courseName,
    totalSeats: course.totalSeats,
    generalSeats: course.reservedSeats?.General ?? 0,
    obcSeats: course.reservedSeats?.OBC ?? 0,
    scSeats: course.reservedSeats?.SC ?? 0,
    stSeats: course.reservedSeats?.ST ?? 0,
    original: course,
  }));

  const columns = [
    { field: "courseId", headerName: "Course ID", minWidth: 120, flex: 0.7 },
    {
      field: "courseName",
      headerName: "Course Name",
      minWidth: 190,
      flex: 1.4,
    },
    {
      field: "totalSeats",
      headerName: "Total Seats",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "generalSeats",
      headerName: "General",
      type: "number",
      minWidth: 110,
      flex: 0.7,
    },
    {
      field: "obcSeats",
      headerName: "OBC",
      type: "number",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "scSeats",
      headerName: "SC",
      type: "number",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "stSeats",
      headerName: "ST",
      type: "number",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      minWidth: 130,
      flex: 0.7,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit course">
            <IconButton
              size="small"
              color="primary"
              onClick={() => onEdit(params.row.original)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete course">
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete(params.row.original)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
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
                No courses found.
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

export default CourseTable;
