import React, { useState } from "react";
import {
  Alert,
  AppBar,
  Box,
  Container,
  IconButton,
  Snackbar,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import api from "../api/api";
import Sidebar, { drawerWidth } from "../components/Sidebar";
import AIChat from "../components/AIChat";

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

  const handleAskQuestion = async (event) => {
    event.preventDefault();

    const question = input.trim();

    if (!question) {
      return;
    }

    const userMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: question,
    };

    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.post("/ai/chat", { question });
      const aiMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: response.data?.answer || "No answer returned.",
      };

      setMessages((previous) => [...previous, aiMessage]);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to get AI answer. Please try again.";

      setMessages((previous) => [
        ...previous,
        {
          id: `${Date.now()}-assistant-error`,
          role: "assistant",
          content: message,
        },
      ]);

      setSnackbar({
        open: true,
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "#f5f7fb" }}>
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <Box
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            display: { xs: "block", md: "none" },
            bgcolor: "white",
            color: "text.primary",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              AI Assistant
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 },  px:{xs:3,md:8}}}>
          <Stack spacing={1} sx={{ mb: 3 }}>
            <Typography
              variant="h4"
              sx={{
                color: "#1565c0",
                fontWeight: 700,
                fontSize: { xs: "1.75rem", sm: "2.125rem" },
              }}
            >
              AI Assistant
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Ask allocation questions and get AI-powered answers from backend
              data.
            </Typography>
          </Stack>

          <AIChat
            messages={messages}
            input={input}
            loading={loading}
            onInputChange={setInput}
            onSubmit={handleAskQuestion}
          />
        </Container>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar((previous) => ({ ...previous, open: false }))
        }
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="error"
          onClose={() =>
            setSnackbar((previous) => ({ ...previous, open: false }))
          }
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AIAssistant;
