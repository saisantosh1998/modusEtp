import React, { useContext, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Button,
  Dialog,
  DialogContent,
  TextField,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { Delete, Mode, Visibility } from "@mui/icons-material";
import "./MyTable.css";
import axios from "axios";
import { useSnackbar } from "notistack";
import { MyContext } from "./MyContext";
function MyTable(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [user, setUser] = useState({
    email: "",
    first_name: "",
    last_name: "",
    address: "",
    phone: "",
  });
  const [editRow, setEditRow] = useState({
    email: "",
    first_name: "",
    last_name: "",
    address: "",
    phone: "",
  });
  const data = props.currentUsersData;
  const {
    headers,
    handleNextPageCall,
    handlePrevPageCall,
    currentPage,
    handleDelete,
    handleSave,
    editOpen,
    setEditOpen,
  } = props;
  const {phoneEditError,setPhoneEditError} = useContext(MyContext);
  
  if (data.length === 0) {
    if (currentPage === 1) {
      handleNextPageCall();
    } else {
      handlePrevPageCall();
    }
  }

  const handleEdit = (row) => {
    setEditOpen(true);
    setEditRow({ ...editRow, ...row });
  };
  const handleEditRow = (event) => {
    const { name, value } = event.target;
    if(name === 'phone'){
      setPhoneEditError(false);
    }
    setEditRow({
      ...editRow,
      [name]: value,
    });
  };
  const handleEditClose = () => {
    setEditOpen(false);
  };
  const handleCancel = () => {
    setEditOpen(false);
  };

  const handleViewClick = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  const viewUser = async (email) => {
    try {
      const url = "http://localhost:8082/v1/user/" + email;
      const result = await axios.get(url);
      if (result.status === 200) {
        setUser(result.data);
        handleViewClick();
      }
    } catch (e) {
      enqueueSnackbar("Something went wrong, please check backend console", {
        variant: "error",
      });
    }
  };
  return (
    <>
      <TableContainer sx={{ height: "81vh" }} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell key={header}>
                  <Typography fontWeight="bold">{header}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.email}>
                <TableCell key="email">{row["email"]}</TableCell>
                <TableCell key="first_name">{row["first_name"]}</TableCell>
                <TableCell key="last_name">{row["last_name"]}</TableCell>
                <TableCell key="address">{row["address"]}</TableCell>
                <TableCell key="role">{row["phone"]}</TableCell>
                <TableCell key="phone">
                  <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <Visibility onClick={(e) => viewUser(row.email)} />
                    <Mode onClick={(e) => handleEdit(row)} />
                    <Delete onClick={(e) => handleDelete(row.email)} />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit User Details</DialogTitle>
        <form onSubmit={(e) => handleSave(e, editRow)}>
          <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            disabled
            name="email"
            type="email"
            fullWidth
            defaultValue={editRow.email}
          />
          <TextField
            margin="dense"
            label="FirstName *"
            name="first_name"
            type="text"
            fullWidth
            value={editRow.first_name}
            onChange={handleEditRow}
          />
          <TextField
            margin="dense"
            label="LastName *"
            name="last_name"
            type="text"
            fullWidth
            value={editRow.last_name}
            onChange={handleEditRow}
          />
          <TextField
            margin="dense"
            label="Address *"
            name="address"
            multiline
            rows={4}
            fullWidth
            value={editRow.address}
            onChange={handleEditRow}
          />
          <TextField
            error={phoneEditError}
            helperText={phoneEditError ? "Phone number must be 10 digits number" : ""}
            margin="dense"
            label="Phone *"
            name="phone"
            type="text"
            fullWidth
            value={editRow.phone}
            onChange={handleEditRow}
          />
          </DialogContent>
          <DialogActions>
            <Button type="submit">Save</Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle
          id="form-dialog-title"
          sx={{ backgroundColor: "black", color: "white" }}
        >
          User Details
        </DialogTitle>
        <DialogContent sx={{ marginTop: "10px" }}>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      backgroundColor: "lightgrey",
                      border: "1px solid grey",
                      padding: "8px",
                    }}
                  >
                    Email:
                  </TableCell>
                  <TableCell style={{ border: "1px solid grey" }}>
                    {user.email}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      backgroundColor: "lightgrey",
                      border: "1px solid grey",
                      padding: "8px",
                    }}
                  >
                    First Name:
                  </TableCell>
                  <TableCell style={{ border: "1px solid grey" }}>
                    {user.first_name}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      backgroundColor: "lightgrey",
                      border: "1px solid grey",
                      padding: "8px",
                    }}
                  >
                    Last Name:
                  </TableCell>
                  <TableCell style={{ border: "1px solid grey" }}>
                    {user.last_name}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      backgroundColor: "lightgrey",
                      border: "1px solid grey",
                      padding: "8px",
                    }}
                  >
                    Address:
                  </TableCell>
                  <TableCell style={{ border: "1px solid grey" }}>
                    {user.address}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      backgroundColor: "lightgrey",
                      border: "1px solid grey",
                      padding: "8px",
                    }}
                  >
                    Phone:
                  </TableCell>
                  <TableCell style={{ border: "1px solid grey" }}>
                    {user.phone}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={handleDialogClose}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default MyTable;
