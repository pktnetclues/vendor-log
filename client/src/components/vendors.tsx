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
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Status from "./Status";
import { logMessage } from "../types";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";

const Vendors = () => {
  const uniqueId: string = uuid().slice(0, 3);
  const [vendors, setVendors] = useState<Array<string>>([]);
  const [selectedVendor, setSelectedVendor] = useState<string>("");
  const [vendorLogs, setVendorLogs] = useState<
    Record<string, Array<logMessage>>
  >({});
  const [ongoingProcesses, setOngoingProcesses] = useState<Array<string>>([]);
  const [visibleVendorLogs, setVisibleVendorLogs] = useState<string | null>(
    null
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
    vendorName: string
  ) => {
    e.preventDefault();
    if (eventSourcesRef.current[vendorName]) {
      return toast.message(`Process already going on for ${vendorName}`);
    }

    try {
      const eventSource = new EventSource(
        `http://localhost:4000/insert/${vendorName}`
      );

      eventSource.onopen = () => {
        eventSourcesRef.current[vendorName] = eventSource;
        setOngoingProcesses((prev) => [...prev, `${uniqueId}-${vendorName}`]);
        toast.success(`Process Started for ${vendorName}`);
      };

      eventSource.onmessage = (event) => {
        const newLog = JSON.parse(event.data);

        setVendorLogs((prevLogs) => ({
          ...prevLogs,
          [`${uniqueId}-${vendorName}`]: [
            ...(prevLogs[`${uniqueId}-${vendorName}`] || []),
            newLog,
          ],
        }));
      };

      eventSource.onerror = (error) => {
        console.error("EventSource error:", error);
        eventSource.close();
        delete eventSourcesRef.current[vendorName];
        toast.success(`Process Completed for ${vendorName}`);
      };
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const toggleVendorLogsVisibility = (vendorName: string) => {
    setVisibleVendorLogs((prev) => (prev === vendorName ? null : vendorName));
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "row",
        maxHeight: "90vh",
        padding: "20px",
        gap: "30px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "550px",
        }}
      >
        <form onSubmit={(e) => startLiveLogging(e, selectedVendor)}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="vendor-label">Select</InputLabel>
              <Select
                labelId="vendor-label"
                id="vendor"
                value={selectedVendor}
                label="Vendor"
                onChange={(e: SelectChangeEvent) =>
                  setSelectedVendor(e.target.value)
                }
                size="medium"
              >
                {vendors.map((vendor, index) => (
                  <MenuItem key={index} value={vendor}>
                    {vendor}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              sx={{
                width: "250px",
              }}
              type="submit"
              variant="contained"
              color="primary"
              disabled={selectedVendor.length === 0}
            >
              Start Insertion
            </Button>
          </Box>
        </form>

        {ongoingProcesses.length > 0 ? (
          ongoingProcesses.map((vendor, index: number) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                width: "550px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">{vendor}</Typography>
                <Button
                  variant="text"
                  onClick={() => toggleVendorLogsVisibility(vendor)}
                >
                  {visibleVendorLogs === vendor ? "Hide Log" : "View Log"}
                </Button>
              </Box>
              {visibleVendorLogs === vendor && (
                <div
                  style={{
                    maxHeight: "40vh",
                    overflowY: "auto",
                    padding: "8px",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "4px",
                  }}
                >
                  {vendorLogs[vendor]?.map((log, index) => {
                    const logColor =
                      log.message === "Updated"
                        ? "#f0b7b7"
                        : log.message === "Skipped"
                        ? "#b7d3d6"
                        : "#c8e4c8";

                    return (
                      <div
                        key={index}
                        style={{
                          marginBottom: "8px",
                          padding: "5px",
                          backgroundColor: logColor,
                          borderRadius: "4px",
                        }}
                      >
                        <span
                          style={{ fontWeight: "bold", marginRight: "8px" }}
                        >
                          {log.message} :
                        </span>
                        <span>
                          {log.data.name} (ID: {log.data.id}) - Price:{" "}
                          {log.data.price}, Quantity: {log.data.quantity}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </Box>
          ))
        ) : (
          <Typography>No Ongoing Process</Typography>
        )}
      </Box>
      <Status />
    </Container>
  );
};

export default Vendors;
