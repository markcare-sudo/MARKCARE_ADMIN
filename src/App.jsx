import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import 'react-phone-input-2/lib/style.css';


function App() {
  return (
    <>
      <Toaster
        visibleToasts={3}
        richColors
      />
      <AppRoutes />
    </>
  );
}

export default App;
