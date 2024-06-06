import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { ProcesssResponse, ProcesssType } from "../types";
import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { TimeAgo } from "../utils/TimeAgo";
import { styles } from "../styles/StatusStyles";

const Status = () => {
  const [successProcesss, setSuccessProcesss] = useState<ProcesssType[]>([]);
  const [errorProcesss, setErrorProcesss] = useState<ProcesssType[]>([]);

  useEffect(() => {
    getProcesss();
  }, []);

  const getProcesss = async () => {
    try {
      const response: AxiosResponse<ProcesssResponse> = await axios.get(
        "http://localhost:4000/getstatus",
      );

      if (response.status === 200) {
        const { SuccessLogs, FailedLogs } = response.data;
        setSuccessProcesss(SuccessLogs);
        setErrorProcesss(FailedLogs);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.successTitle}>Success Processes</h1>
      <List sx={styles.list}>
        {successProcesss.map((processs) => (
          <ListItem sx={styles.listItem} key={processs.id}>
            <ListItemText>
              <strong>{processs.vendor_name}</strong> -{" "}
              {processs.total_inserted} Inserted - {processs.total_updated}{" "}
              Updated - {processs.total_skipped} Skipped
              <Typography
                sx={{
                  color: "#008000",
                  fontWeight: "bold",
                  marginLeft: "10px",
                }}>
                {TimeAgo(processs.time)}
              </Typography>
            </ListItemText>
          </ListItem>
        ))}
      </List>
      <h1 style={styles.errorTitle}>Error Processes</h1>
      <ul style={styles.errorList}>
        {errorProcesss.length > 0 &&
          errorProcesss.map((processs) => (
            <li key={processs.id} style={styles.errorListItem}>
              <strong>{processs.vendor_name}</strong> -{" "}
              {processs.total_inserted} Inserted - {processs.total_updated}{" "}
              Updated - {processs.total_skipped} Skipped
            </li>
          ))}
        {errorProcesss.length === 0 && (
          <li style={styles.errorListItem}>No Error Processes</li>
        )}
      </ul>
    </div>
  );
};

export default Status;
