import { useEffect, useState } from "react";
import { ProcesssType } from "../types";
import { List, ListItem, ListItemText } from "@mui/material";
import { TimeAgo } from "../utils/TimeAgo";
import { styles } from "../styles/StatusStyles";
import { getProcesss } from "../utils/GetStatus";

const Status = () => {
  const [successProcesss, setSuccessProcesss] = useState<ProcesssType[]>([]);
  const [errorProcesss, setErrorProcesss] = useState<ProcesssType[]>([]);

  useEffect(() => {
    getProcessResponse()
  }, []);

  const getProcessResponse = async () => {
    const data = await getProcesss()
    setSuccessProcesss(data?.SuccessLogs ?? successProcesss)
    setErrorProcesss(data?.FailedLogs ?? errorProcesss)
  }

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
