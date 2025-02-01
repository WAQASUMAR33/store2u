"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Toolbar,
  InputBase,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  IconButton,
  TablePagination,
} from "@mui/material";
import { useTable, useGlobalFilter, useSortBy, usePagination } from "react-table";
import { FaUserEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "",
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    id: null,
  });

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await axios.get("/api/faq");
      setFaqs(response.data);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch FAQs.",
        type: "error",
      });
    }
  };

  const handleAddOpen = () => {
    setFormData({
      question: "",
      answer: "",
    });
    setOpenAddDialog(true);
  };

  const handleAddClose = () => {
    setOpenAddDialog(false);
  };

  const handleEditOpen = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
    });
    setOpenEditDialog(true);
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
    setEditingFaq(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!formData.question || !formData.answer) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields.",
        type: "error",
      });
      return;
    }

    try {
      await axios.post("/api/faq", formData);
      setSnackbar({
        open: true,
        message: "FAQ added successfully.",
        type: "success",
      });
      fetchFaqs();
      handleAddClose();
    } catch (error) {
      console.error("Error adding FAQ:", error);
      setSnackbar({
        open: true,
        message: "Failed to add FAQ.",
        type: "error",
      });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!formData.question || !formData.answer) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields.",
        type: "error",
      });
      return;
    }

    try {
      await axios.put(`/api/faq/${editingFaq.id}`, formData);
      setSnackbar({
        open: true,
        message: "FAQ updated successfully.",
        type: "success",
      });
      fetchFaqs();
      handleEditClose();
    } catch (error) {
      console.error("Error updating FAQ:", error);
      setSnackbar({
        open: true,
        message: "Failed to update FAQ.",
        type: "error",
      });
    }
  };

  const handleDelete = (id) => {
    setDeleteConfirmation({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/api/faq/${deleteConfirmation.id}`);
      setSnackbar({
        open: true,
        message: "FAQ deleted successfully.",
        type: "warning",
      });
      fetchFaqs();
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete FAQ.",
        type: "error",
      });
    } finally {
      setDeleteConfirmation({ open: false, id: null });
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({ open: false, id: null });
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Question",
        accessor: "question",
      },
      {
        Header: "Answer",
        accessor: "answer",
      },
      {
        Header: "Created At",
        accessor: "createdAt",
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
      {
        Header: "Updated At",
        accessor: "updatedAt",
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div className="flex gap-6">
            <FaUserEdit
              onClick={() => handleEditOpen(row.original)}
              style={{
                fontSize: "26px",
                color: "#006a5c",
                cursor: "pointer",
              }}
            />
            <MdDeleteForever
              onClick={() => handleDelete(row.original.id)}
              style={{ fontSize: "26px", color: "#b03f37", cursor: "pointer" }}
            />
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    setGlobalFilter,
    gotoPage,
    setPageSize,
  } = useTable(
    {
      columns,
      data: faqs,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { pageIndex, pageSize, globalFilter } = state;

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <Toolbar>
          <InputBase
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value || undefined)}
            placeholder="Search FAQs"
            style={{
              padding: "6px 10px",
              backgroundColor: "#eaeaea",
              borderRadius: "4px",
            }}
          />
        </Toolbar>
        <Button variant="contained" color="primary" onClick={handleAddOpen}>
          Add New FAQ
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell key={column.id} {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <TableRow key={row.id} {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <TableCell key={cell.id} {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
            {page.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No FAQs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, { label: "All", value: faqs.length }]}
        component="div"
        count={faqs.length}
        rowsPerPage={pageSize}
        page={pageIndex}
        onPageChange={(event, newPage) => gotoPage(newPage)}
        onRowsPerPageChange={(event) => setPageSize(Number(event.target.value))}
      />

      <Dialog open={openAddDialog} onClose={handleAddClose} maxWidth="xl" fullWidth>
        <DialogTitle>
          Add New FAQ
          <IconButton
            aria-label="close"
            onClick={handleAddClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleAddSubmit}>
            <TextField
              label="Question"
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Answer"
              name="answer"
              value={formData.answer}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
              multiline
              rows={4}
            />
            <DialogActions>
              <Button onClick={handleAddClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary" variant="contained">
                Save
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={openEditDialog} onClose={handleEditClose} maxWidth="xl" fullWidth>
        <DialogTitle>
          Edit FAQ
          <IconButton
            aria-label="close"
            onClick={handleEditClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleEditSubmit}>
            <TextField
              label="Question"
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Answer"
              name="answer"
              value={formData.answer}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
              multiline
              rows={4}
            />
            <DialogActions>
              <Button onClick={handleEditClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary" variant="contained">
                Update
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteConfirmation.open}
        onClose={handleCancelDelete}
        aria-labelledby="delete-confirmation-title"
        aria-describedby="delete-confirmation-description"
      >
        <DialogTitle id="delete-confirmation-title">
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          {deleteConfirmation.id && (
            <p>
              Are you sure you want to delete the FAQ with ID {deleteConfirmation.id}?
            </p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.type}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default FAQ;
