import { Box, Container } from "@mui/material";
import React from "react";
import Home from "./pages/Home";

const App = () => {
  return (
    <Box sx={{ background: "rgb(255,254,254)" }}>
      <Container maxWidth>
        <Home />
      </Container>
    </Box>
  );
};

export default App;
