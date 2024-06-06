import axios from "axios";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Container,
  List,
  ListItem,
  ListItemText,
  Button,
  ListItemIcon,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import Status from "./Status";
import { logMessage } from "../types";

const Vendors = () => {
  const [vendors, setVendors] = useState<Array<string>>([]);
  const [selectedVendor, setSelectedVendor] = useState<string>("");
  const [vendorLogs, setVendorLogs] = useState<
    Record<string, Array<logMessage>>
  >({});
  const [ongoingProcesses, setOngoingProcesses] = useState<Array<string>>([]);
  const [visibleVendorLogs, setVisibleVendorLogs] = useState<string | null>(
    null,
  );
  const eventSourcesRef = useRef<Record<string, EventSource>>({});

  useEffect(() => {
    getVendors();
  }, []);

  const getVendors = async () => {
    try {
      const response = await axios.get("http://localhost:4000/vendors");
      if (response.status === 200) {
        setVendors(response.data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const startLiveLogging = async (
    e: React.FormEvent<HTMLFormElement>,
    vendorName: string,
  ) => {
    e.preventDefault();

    if (eventSourcesRef.current[vendorName]) {
      console.log(`Logging already started for vendor ${vendorName}`);
      return;
    }

    try {
      const eventSource = new EventSource(
        `http://localhost:4000/insert/${vendorName}`,
      );
      eventSourcesRef.current[vendorName] = eventSource;
      setOngoingProcesses((prev) => [...prev, vendorName]);

      eventSource.onmessage = (event) => {
        const newLog = JSON.parse(event.data);
        setVendorLogs((prevLogs) => ({
          ...prevLogs,
          [vendorName]: [...(prevLogs[vendorName] || []), newLog],
        }));
      };

      eventSource.onerror = (error) => {
        console.error("EventSource error:", error);
        eventSource.close();
        delete eventSourcesRef.current[vendorName];
      };
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const onVendorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVendor(e.target.value);
  };

  const toggleVendorLogsVisibility = (vendorName: string) => {
    setVisibleVendorLogs((prev) => (prev === vendorName ? null : vendorName));
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px",
      }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "600px",
        }}>
        <form onSubmit={(e) => startLiveLogging(e, selectedVendor)}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="vendor-label">Select Vendor</InputLabel>
              <Select
                labelId="vendor-label"
                id="vendor"
                value={selectedVendor}
                label="Vendor"
                onChange={onVendorChange}
                size="medium">
                {vendors.map((vendor, index) => (
                  <MenuItem key={index} value={vendor}>
                    {vendor}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary">
              Start Insertion
            </Button>
          </Box>
        </form>

        {ongoingProcesses.map((vendor) => (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              width: "600px",
              padding: "20px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6">{vendor}</Typography>
              <Button
                variant="text"
                onClick={() => toggleVendorLogsVisibility(vendor)}>
                {visibleVendorLogs === vendor ? "Hide Log" : "View Log"}
              </Button>
            </Box>
            {visibleVendorLogs === vendor && (
              <Box
                sx={{
                  overflowY: "auto",
                  maxHeight: "50vh",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  padding: 1,
                }}>
                <List>
                  {vendorLogs[vendor]?.map((log) => {
                    const logColor =
                      log.message === "Updated"
                        ? "#FFD0D0"
                        : log.message === "Skipped"
                        ? "#9AC8CD"
                        : "#D9EAD3";

                    return (
                      <ListItem
                        sx={{
                          backgroundColor: logColor,
                          borderRadius: "4px",
                          marginBottom: "4px",
                          display: "flex",
                          alignItems: "center",
                        }}
                        key={log?.data.id}>
                        <ListItemIcon>
                          {log.message === "Updated" ? (
                            <EditIcon />
                          ) : log.message === "Skipped" ? (
                            <DirectionsRunIcon />
                          ) : (
                            <DoneIcon />
                          )}
                        </ListItemIcon>
                        <ListItemText>
                          {log.data.name} (ID: {log.data.id}) - Price:{" "}
                          {log.data.price}, Quantity: {log.data.quantity} -{" "}
                          {log.message}
                        </ListItemText>
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
            )}
          </Box>
        ))}
      </Box>
      <Status />
    </Container>
  );
};

export default Vendors;
