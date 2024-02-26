import { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "../Components/Calendar";

const Dashboard = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: {
      number: "",
      street: "",
      zip: "",
    },
  });

  const [isEligible, setIsEligible] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    number: "",
    street: "",
    zip: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(`https://api-accenture-3y3u.vercel.app/users/${userId}`);
        const userData = response.data;
        setUser(userData);

        // Calcul de l'éligibilité
        const destinationsCount = {};
        userData.calendar.forEach((event) => {
          if (event._destination in destinationsCount) {
            destinationsCount[event._destination]++;
          } else {
            destinationsCount[event._destination] = 1;
          }
        });

        const mostCommonDestination = Object.keys(destinationsCount).reduce((a, b) => {
          if (destinationsCount[a] === destinationsCount[b]) {
            const aEvents = userData.calendar.filter((event) => event._destination === a && event.isEligible);
            const bEvents = userData.calendar.filter((event) => event._destination === b && event.isEligible);
            if (aEvents.length > 0 || bEvents.length > 0) {
              return aEvents.length > 0 ? a : b;
            }
          }
          return destinationsCount[a] > destinationsCount[b] ? a : b;
        });

        const mostCommonDestinationEvents = userData.calendar.filter(
          (event) => event._destination === mostCommonDestination
        );

        setIsEligible(mostCommonDestinationEvents.length > 0 ? mostCommonDestinationEvents[0].isEligible : false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur :", error);
      }
    };

    fetchUserData();

  }, []);

  useEffect(() => {
    // Mettre à jour le formulaire avec l'adresse actuelle lorsque showAddressForm est true
    if (showAddressForm) {
      setNewAddress(user.address);
    }
  }, [showAddressForm, user.address]);

  const handleSvgClick = async () => {
    setShowAddressForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");
      await axios.patch(`https://api-accenture-3y3u.vercel.app/users/${userId}/address`, { address: newAddress });
      setUser((prevUser) => ({
        ...prevUser,
        address: newAddress,
      }));
      setShowAddressForm(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'adresse :", error);
    }
  };

  return (
    <div className="container mx-auto grid grid-cols-2 gap-11 p-11 mt-11">
      <div>
        <h2 className="text-2xl font-bold mb-4 p-9">Welcome {user.firstName} to your profile</h2>
        <ul className="profil pl-4 mb-11">
          <li className="mb-2">Firstname: {user.firstName}</li>
          <li className="mb-2">Lastname: {user.lastName}</li>
          <li className="mb-2">Email: {user.email}</li>
          {showAddressForm ? (
            <form onSubmit={handleSubmit}>
              <input type="text" name="number" value={newAddress.number} onChange={handleInputChange} placeholder="Number" />
              <input type="text" name="street" value={newAddress.street} onChange={handleInputChange} placeholder="Street" />
              <input type="text" name="zip" value={newAddress.zip} onChange={handleInputChange} placeholder="ZIP" />
              <button type="submit">Update Address</button>
            </form>
          ) : (
            <li className="mb-2">
              Address: {user.address.number} {user.address.street}, {user.address.zip}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" onClick={handleSvgClick} style={{ cursor: 'pointer' }}>
                <path d="m16 2.012 3 3L16.713 7.3l-3-3zM4 14v3h3l8.299-8.287-3-3zm0 6h16v2H4z"></path>
              </svg>
            </li>
          )}
        </ul>
        <div className="container mx-auto grid grid-cols-2 gap-11 p-11 mt-11 text-center">
          <h1
            className={`text-center mb-11 p-2 ${
              isEligible
                ? "bg-purple-800 text-white rounded-md"
                : "bg-gray-300 text-gray-400 rounded-md"
            }`}
          >
            {isEligible ? "ELIGIBLE" : "NOT ELIGIBLE"}
          </h1>
        </div>
      </div>
      <Calendar />
    </div>
  );
};

export default Dashboard;
