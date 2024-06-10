export const styles = {
  container: {
    // padding: "10px",
    // backgroundColor: "#f5f5f5",
    // margin: "20px 0",
    width: "500px",
  },
  successTitle: { color: "#008000", fontSize: "20px" },
  errorTitle: { color: "#ff0000", marginTop: "30px", marginBottom: "20px" },
  list: {
    flex: 1,
    overflowY: "auto",
    maxHeight: "40vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    padding: 1,
    marginTop: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#fff",
  },
  listItem: {
    textDecoration: "none",
    color: "inherit",
    "&:hover": {
      backgroundColor: "#f0f0f0",
    },
    padding: "10px",
    borderBottom: "1px solid #ccc",
  },
};
