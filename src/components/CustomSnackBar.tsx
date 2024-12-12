import { Alert, Snackbar } from "@mui/material";
import React from "react";

interface CustomSnackBarProps {
  vertical: "top" | "bottom";
  horizontal: "left" | "center" | "right";
  openSnack: boolean;
  handleCloseSnack: () => void;
  severity: "success" | "error" | "warning" | "info";
  message: string;
}

const CustomSnackBar: React.FC<CustomSnackBarProps> = ({
  vertical,
  horizontal,
  openSnack,
  handleCloseSnack,
  severity,
  message,
}) => {
  return (
    <Snackbar
      autoHideDuration={5000}
      anchorOrigin={{ vertical, horizontal }}
      open={openSnack}
      onClose={handleCloseSnack}
    >
      <Alert
        variant="filled"
        onClose={handleCloseSnack}
        severity={severity}
        sx={{ width: "100%", color: "white" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackBar;
