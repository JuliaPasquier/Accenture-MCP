import React from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/login";  
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardAdmin from "./pages/DashboardAdmin";




// 1. import `NextUIProvider` component
import { NextUIProvider } from "@nextui-org/react";



import Header from "./Components/Header";




function App() {

  return (
    
    <NextUIProvider>
      <div className="App">

        <Router>

          <Header />
          <Routes>
            <Route path="/" element={<Login />} />

            <Route path="/Dashboard" element={<Dashboard />} />

            <Route path="/DashboardAdmin" element={<DashboardAdmin />} />

          </Routes>
        </Router>

      </div>
    </NextUIProvider>
  );

}
export default App;

/* Experimentation fetch geolocalisation
 
fetch('http://localhost:4000/distance')
.then(response => {
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération de la distance');
  }
  return response.json();
})
.then(data => {
  // Faire quelque chose avec la distance récupérée
  console.log('Distance entre les adresses:', data.distance, 'meters');
})
.catch(error => {
  console.error('Une erreur s\'est produite :', error);
});
*/
