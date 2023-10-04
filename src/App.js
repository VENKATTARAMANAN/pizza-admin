import { Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./Screens/LoginPage";
import Orders from "./Screens/Orders";
import Stock from "./Screens/Stock";
import Pizza from "./Screens/Pizza";
import CompletedOrders from "./Screens/CompletedOrders";
import AddPizza from "./Screens/AddPizza";
import EditPizza from "./Screens/EditPizza";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/pizza" element={<Pizza />} />
        <Route path="/completedorders" element={<CompletedOrders/>}/>
        <Route path="/addpizza" element={<AddPizza/>}/>
        <Route path="/editpizza/:id" element={<EditPizza/>}/>
      </Routes>
    </>
  );
}

export default App;
