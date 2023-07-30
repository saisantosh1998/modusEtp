import React from "react";
import { Button } from "@mui/material";
import "./CustomButton.css";
function CustomButton({ number, selectedPage }) {
  return (
    <Button
      variant="contained"
      className={selectedPage === number ? "selected" : "custom-button"}
    >
      {number}
    </Button>
  );
}

export default CustomButton;
