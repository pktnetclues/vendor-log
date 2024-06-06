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
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";

const Vendors = () => {
  const [vendors, setVendors] = useState<Array<string>>([]);
  const [selectedVendor, setSelectedVendor] = useState<string>("");
  const [liveLogs, setLiveLogs] = useState<Array<logMessage>>([]);

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
    try {
      const eventSource = new EventSource(
        `http://localhost:4000/insert/${vendorName}`
      );
      eventSource.onmessage = (event) => {
        const newLog = JSON.parse(event.data);
        setLiveLogs((prevLogs) => [...prevLogs, newLog]);
        setSelectedVendor("");
      };

      if (eventSource.readyState === EventSource.CLOSED) {
        setLiveLogs([]);
        setSelectedVendor("");
      }

      eventSource.onerror = (error) => {
        console.error("EventSource error:", error);
        eventSource.close();
      };
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const onVendorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVendor(e.target.value);
  };

  //Scroll to bottom of chat
  //   const logRef = useRef(null);
  //   const scrollToBottom = () => {
  //     logRef.current.scrollIntoView({ behaviour: "smooth" });
  //   };

  //   useEffect(() => {
  //     scrollToBottom();
  //   }, [liveLogs]);

  return (
    <Container
      sx={{
        display: "flex",
        gap: "50px",
        margin: "auto",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "50px",
        }}
      >
        <form onSubmit={(e) => startLiveLogging(e, selectedVendor)}>
          <Box sx={{ width: "500px", display: "flex", gap: 2 }}>
            <FormControl sx={{ width: "300px" }}>
              <InputLabel size="normal" id="vendor-label">
                Select Vendor
              </InputLabel>
              <Select
                labelId="vendor-label"
                id="vendor"
                value={selectedVendor}
                label="Vendor"
                onChange={onVendorChange}
                size="medium"
              >
                {vendors.map((vendor, index) => (
                  <MenuItem key={index} value={vendor}>
                    {vendor}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button type="submit" variant="outlined">
              Start Insertion
            </Button>
          </Box>
        </form>
        {liveLogs.length > 0 && (
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              maxHeight: "50vh",
              width: "500px",
              display: "flex",
              flexDirection: "column",
              padding: 1,
            }}
          >
            <h2>Live Logs:</h2>
            <List>
              {liveLogs.map((log) => {
                if (log.message === "Updated") {
                  return (
                    <ListItem
                      sx={{
                        backgroundColor: "#FFD0D0",
                      }}
                      key={log?.data.id}
                    >
                      <ListItemIcon>
                        <EditIcon />
                      </ListItemIcon>
                      <ListItemText>
                        Product {log.data.name} with Row Id: {log.data.id}:
                        price:
                        {log.data.price} and Quantity: {log.data.quantity}:
                        Updated
                      </ListItemText>
                    </ListItem>
                  );
                } else if (log.message === "Skipped") {
                  return (
                    <ListItem
                      sx={{
                        backgroundColor: "#9AC8CD",
                      }}
                      key={log?.data.id}
                    >
                      <ListItemIcon>
                        <DirectionsRunIcon />
                      </ListItemIcon>
                      <ListItemText>
                        Product {log.data.name} with Row Id: {log.data.id}:
                        price:
                        {log.data.price} and Quantity: {log.data.quantity}:
                        Skipped
                      </ListItemText>
                    </ListItem>
                  );
                } else {
                  return (
                    <ListItem key={log?.data.id}>
                      <ListItemIcon>
                        <DoneIcon />
                      </ListItemIcon>
                      <ListItemText>
                        Product {log.data.name} with Row Id: {log.data.id}:
                        price:
                        {log.data.price} and Quantity: {log.data.quantity}:
                        Inserted
                      </ListItemText>
                    </ListItem>
                  );
                }
              })}
            </List>
            {/* <div ref={logRef} /> */}
          </Box>
        )}
      </Box>
    </Container>
  );
};

interface logMessage {
  message: string;
  data: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  };
}

export default Vendors;
