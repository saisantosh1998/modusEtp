import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import "./Navbar.css";
import axios from "axios";
import { useSnackbar } from "notistack";
import { MyContext } from "./MyContext";

function Navbar() {
  const [openDialog, setOpenDialog] = useState(false);
  const { setAddedUser } = useContext(MyContext);
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    address: "",
    phone: "",
  });
  const [phoneError, setPhoneError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [formError, setFormError] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormError(false);
    if (name === "phone") setPhoneError(false);
    if (name === "email") setEmailError(false);
    setForm({
      ...form,
      [name]: value,
    });
  };
  const addUser = async (e) => {
    e.preventDefault();
    // checking all fields are provided
    if (
      form.email.length === 0 ||
      form.first_name.length === 0 ||
      form.last_name.length === 0 ||
      form.address.length === 0 ||
      form.phone.length === 0
    ) {
      setFormError(true);
      return;
    }
    // Email validation
    const email = form.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(true);
      return;
    }

    // Phone validation
    const phoneNumber = form.phone;
    const phoneRegex = /^[1-9][0-9]{9}$/
    if (!phoneRegex.test(phoneNumber)) {
      setPhoneError(true);
      return;
    }

    try {
      const url = "http://localhost:8082/v1/user/addUser";
      const result = await axios.post(url, form);
      if (result.status === 201) {
        setAddedUser(true);
        enqueueSnackbar("Successfully added user", {
          variant: "success",
        });
      }
    } catch (e) {
      if (e.response.status === 409) {
        enqueueSnackbar(e.response.data.message, {
          variant: "warning",
        });
      }else if(e.response){
        enqueueSnackbar(e.response.data.message, {
          variant: "error",
        });
      } else {
        enqueueSnackbar("Something went wrong, please check backend console", {
          variant: "error",
        });
      }
    }
    handleDialogClose();
  };
  const handleClick = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setForm({
      email: "",
      first_name: "",
      last_name: "",
      address: "",
      phone: "",
    });
    setOpenDialog(false);
    setEmailError(false);
    setPhoneError(false);
    setFormError(false);
  };
  return (
    <div className="navbar-root">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className="navbar-title">
            User Management
          </Typography>
          <Button
            color="inherit"
            className="navbar-button"
            onClick={handleClick}
          >
            Add User
          </Button>
        </Toolbar>
      </AppBar>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle
          id="form-dialog-title"
          sx={{ backgroundColor: "black", color: "white" }}
        >
          Add User
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            error={emailError}
            helperText={emailError ? "Invalid email format" : ""}
            margin="dense"
            label="Email *"
            name="email"
            type="email"
            fullWidth
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="FirstName *"
            name="first_name"
            type="text"
            fullWidth
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="LastName *"
            name="last_name"
            type="text"
            fullWidth
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Address *"
            name="address"
            multiline
            rows={4}
            fullWidth
            onChange={handleChange}
          />
          <TextField
            error={phoneError}
            helperText={phoneError ? "Phone number must be 10 digits number" : ""}
            margin="dense"
            label="Phone *"
            name="phone"
            type="tel"
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*', // Only numbers are allowed
            }}
            fullWidth
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={handleDialogClose}
            color="secondary"
          >
            Cancel
          </Button>
          <Button variant="outlined" onClick={addUser} color="primary">
            Add
          </Button>
        </DialogActions>
        {formError && (
          <Typography color="error" align="center" style={{ margin: "16px" }}>
            Please fill out all required fields.
          </Typography>
        )}
      </Dialog>
    </div>
  );
}

export default Navbar;
