import { CssBaseline } from "@mui/material";
import Vendors from "./components/vendors";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <CssBaseline />
      <Vendors />
    </>
  );
}

export default App;
