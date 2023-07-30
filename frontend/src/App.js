import "./App.css";
import { MyProvider } from "./components/MyContext";
import Navbar from "./components/Navbar";
import TableSection from "./components/TableSection";

function App() {
  return (
    <div className="App">
      <MyProvider>
        <Navbar />
        <TableSection />
      </MyProvider>
    </div>
  );
}

export default App;
