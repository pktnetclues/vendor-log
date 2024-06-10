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
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import Status from "./Status";
import { logMessage } from "../types";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";


const Vendors = () => {
  const uniqueId: string = uuid().slice(0, 3)
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
        toast.success(`Process Started for ${vendorName}`)
      }

      eventSource.onmessage = (event) => {
        const newLog = JSON.parse(event.data);

        setVendorLogs((prevLogs) => ({
          ...prevLogs,
          [`${uniqueId}-${vendorName}`]: [...(prevLogs[`${uniqueId}-${vendorName}`] || []), newLog],
        }));
      }

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
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
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

        {
          ongoingProcesses.length > 0 ? ongoingProcesses.map((vendor, index: number) => (
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
                <Box
                  sx={{
                    overflowY: "auto",
                    maxHeight: "40vh",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    padding: 1,
                  }}
                >
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
                            display: "flex",
                            alignItems: "center",
                          }}
                          key={log?.data.id}
                        >
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
          ))
            :
            <Typography>No Ongoing Process</Typography>
        }
      </Box>
      <Status />
    </Container>
  );
};

export default Vendors;
