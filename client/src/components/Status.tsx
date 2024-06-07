import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { ProcesssResponse, ProcesssType } from "../types";
import { List, ListItem, ListItemText } from "@mui/material";
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
        "http://localhost:4000/getstatus"
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
      <h3 style={styles.successTitle}>Success Processes</h3>
      <List sx={styles.list}>
        {successProcesss.length > 0 &&
          successProcesss.map((processs) => {
            return (
              <ListItem sx={styles.listItem} key={processs.id}>
                <ListItemText>
                  <span
                    style={{
                      color: "#008000",
                    }}
                  >
                    {TimeAgo(processs.time)} :{" "}
                  </span>
                  <strong>{processs.vendor_name}</strong> -{" "}
                  {processs.total_inserted} Inserted - {processs.total_updated}{" "}
                  Updated - {processs.total_skipped} Skipped
                </ListItemText>
              </ListItem>
            );
          })}
        {successProcesss.length === 0 && (
          <li style={styles.listItem}>No Processes</li>
        )}
      </List>
      <h3 style={styles.errorTitle}>Error Processes</h3>
      <List sx={styles.list}>
        {errorProcesss.length > 0 &&
          errorProcesss.map((processs) => {
            return (
              <ListItem sx={styles.listItem} key={processs.id}>
                <ListItemText>
                  <span
                    style={{
                      color: "#008000",
                    }}
                  >
                    {TimeAgo(processs.time)} :{" "}
                  </span>
                  <strong>{processs.vendor_name}</strong> -{" "}
                  {processs.total_inserted} Inserted - {processs.total_updated}{" "}
                  Updated - {processs.total_skipped} Skipped
                </ListItemText>
              </ListItem>
            );
          })}
        {errorProcesss.length === 0 && (
          <li style={styles.listItem}>No Processes</li>
        )}
      </List>
    </div>
  );
};

export default Status;
