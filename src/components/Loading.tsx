import { Box, CircularProgress, Dialog, Typography } from "@mui/material";
import React from "react";

interface LoadingProps {
  open: boolean;
  onClose?: (args: any) => void;
}

const Loading = (props: LoadingProps) => {
  const { open, onClose } = props;
  return (
    <>
      <Dialog disableScrollLock={true} open={open} onClose={onClose && onClose}>
        <Box
          sx={{
            textAlign: "center",
            padding: "16px",
          }}
        >
          <CircularProgress />
          <Typography sx={{ fontWeight: 700 }}>Please wait</Typography>
        </Box>
      </Dialog>
    </>
  );
};

export default Loading;
