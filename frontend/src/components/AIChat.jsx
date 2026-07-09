import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";

const AIChat = ({
  messages = [],
  input,
  loading,
  onInputChange,
  onSubmit,
}) => {
  return (
    <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
      <Stack
        sx={{
          height: { xs: "70vh", md: "72vh" },
          minHeight: 520,
          bgcolor: "white",
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{
            px: { xs: 2, sm: 3 },
            py: 2,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <SmartToyIcon sx={{ color: "#1565c0" }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              AI Allocation Assistant
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Ask about student allocation results.
            </Typography>
          </Box>
        </Stack>

        <Stack
          spacing={2}
          sx={{
            flex: 1,
            overflowY: "auto",
            p: { xs: 2, sm: 3 },
            bgcolor: "#f8fafc",
          }}
        >
          {messages.length === 0 && (
            <Box
              sx={{
                maxWidth: 620,
                alignSelf: "center",
                textAlign: "center",
                mt: "auto",
                mb: "auto",
              }}
            >
              <SmartToyIcon sx={{ fontSize: 44, color: "#1565c0", mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Start a conversation
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Type your allocation question below and the AI will answer using
                backend allocation data.
              </Typography>
            </Box>
          )}

          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                maxWidth: { xs: "92%", sm: "78%" },
              }}
            >
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                  bgcolor:
                    message.role === "user" ? "#1565c0" : "background.paper",
                  color: message.role === "user" ? "white" : "text.primary",
                  boxShadow:
                    message.role === "user"
                      ? "none"
                      : "0 1px 4px rgba(0, 0, 0, 0.08)",
                }}
              >
                <Typography
                  component="div"
                  variant="body1"
                  sx={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}
                >
                  {message.content}
                </Typography>
              </Box>
            </Box>
          ))}

          {loading && (
            <Box sx={{ alignSelf: "flex-start", maxWidth: "78%" }}>
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                  bgcolor: "background.paper",
                  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.08)",
                }}
              >
                <CircularProgress size={18} />
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Analyzing allocation data...
                </Typography>
              </Stack>
            </Box>
          )}
        </Stack>

        <Box
          component="form"
          onSubmit={onSubmit}
          sx={{
            p: { xs: 2, sm: 3 },
            borderTop: "1px solid #e0e0e0",
            bgcolor: "white",
          }}
        >
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={input}
              onChange={(event) => onInputChange(event.target.value)}
              placeholder="Type your question..."
              disabled={loading}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              endIcon={<SendIcon />}
              disabled={loading || !input.trim()}
              sx={{
                minWidth: { xs: "100%", sm: 130 },
                alignSelf: { xs: "stretch", sm: "flex-end" },
              }}
            >
              Send
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};

export default AIChat;
