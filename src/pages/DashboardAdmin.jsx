import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";

const columnsEmployees = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "address", label: "Address" },
  { key: "isEligible", label: "Eligible" }, // Nouvelle colonne
];

const columnsClients = [
  { key: "name", label: "Name" },
  { key: "address", label: "Address" },
];

const DashboardAdmin = () => {
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState([]);
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [zip, setZip] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [redirectToDashboard, setRedirectToDashboard] = useState(null);

  useEffect(() => {
    Promise.all([fetchEmployees(), fetchClients()])
      .then(([employeesData, clientsData]) => {
        const filteredEmployees = employeesData.filter(
          (employee) => employee.firstName !== "Home"
        );
        setEmployees(filteredEmployees);
        const filteredClients = clientsData.filter(
          (client) => client.name !== "Home"
        );
        setClients(filteredClients);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
// fonction pour récupérer les employés
  const fetchEmployees = async () => {
    const response = await fetch("https://api-accenture-3y3u.vercel.app/users");
    const data = await response.json();
    return data;
  };
// fonction pour récupérer les clients
  const fetchClients = async () => {
    const response = await fetch(
      "https://api-accenture-3y3u.vercel.app/destination"
    );
    const data = await response.json();
    return data;
  };

  const openEmployeeModal = () => {
    setIsEmployeeModalOpen(true);
  };

  const openClientModal = () => {
    setIsClientModalOpen(true);
  };

  const closeModal = () => {
    setIsEmployeeModalOpen(false);
  };

  const closeClientModal = () => {
    setIsClientModalOpen(false);
  };
// fonction pour calculer si l'employé est éligible
  const calculateIsEligible = (employee) => {
    const destinationsCount = {};
    employee.calendar.forEach((event) => {
      if (event._destination in destinationsCount) {
        destinationsCount[event._destination]++;
      } else {
        destinationsCount[event._destination] = 1;
      }
    });

    let mostCommonDestination = null;
    let maxCount = 0;
    Object.keys(destinationsCount).forEach((destination) => {
      if (destinationsCount[destination] > maxCount) {
        mostCommonDestination = destination;
        maxCount = destinationsCount[destination];
      }
    });

    const isEligible = employee.calendar.some(
      (event) =>
        event._destination === mostCommonDestination && event.isEligible
    );

    return isEligible ? "Yes" : "No";
  };

  // fonction pour créer un tableau
  const createTable = (columns, rows) => {
    return (
      <Table aria-label="Table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={rows}>
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => {
                if (columnKey === "isEligible") {
                  const isEligible = calculateIsEligible(item);
                  return (
                    <TableCell className={isEligible === "Yes" ? "bg-green-200" : "bg-red-200"}>
                      {isEligible}
                    </TableCell>
                  );
                } else {
                  return (
                    <TableCell>{getColumnValue(item, columnKey)}</TableCell>
                  );
                }
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  };
  

  // fonction pour récupérer la valeur de la colonne

  const getColumnValue = (item, columnKey) => {
    if (columnKey === "address") {
      if (item.address) {
        const { number, street, zip } = item.address;
        return `${number} ${street}, ${zip}`;
      }
      return "";
    }
    return item[columnKey] || "";
  };

  /* return ( */
  const handleSubmitEmployee = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        "https://api-accenture-3y3u.vercel.app/users/employee",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            address: { number, street, zip },
          }),
        }
      );
      //Fetch the data

      const data = await response.json();
      console.log("Response data:", data);
      if (response.ok) {
        //setEmployees([...employees, data]);
        closeModal();
      }
    } catch (error) {
      setErrorMessage("error during creation");
    }
    window.location.reload();
  };

  const handleSubmitClient = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        "https://api-accenture-3y3u.vercel.app/destination",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, address: { number, street, zip } }),
        }
      );
      const data = await response.json();
      console.log("Response data:", data);
    
      if (response.ok) {
        // setClients([...clients, data]);
        closeClientModal();
        
      }
    } catch (error) {
      setErrorMessage("Error during creation");
    }
    window.location.reload();
  };

  return (
    <div className="mt-11">
      <div className="flex justify-end">
        <button
          className="mr-52 mt-5 bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
          onClick={openEmployeeModal}
        >
          Create Employee
        </button>
      </div>

      <h1 className="ml-52 text-3xl">Employees</h1>
      {createTable(columnsEmployees, employees)}

      <div className="flex justify-end">
        <button
          className="mr-52 mt-5 bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
          onClick={openClientModal}
        >
          Create Client
        </button>
      </div>

      <h1 className="ml-52 text-3xl">Clients</h1>
      {createTable(columnsClients, clients)}

      <Modal
        isOpen={isEmployeeModalOpen}
        onRequestClose={closeModal}
        contentLabel="Create Employee Modal"
      >
        <div>
          <div>
            <button
              className="absolute top-0 right-0 m-2 bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded"
              onClick={closeModal}
            >
              X
            </button>
            <h1 className="text-center p-11 mb-20">Create Employee</h1>

            <form onSubmit={handleSubmitEmployee} className="text-center">
              <input
                className="mr-4 border-solid border-1 border-black rounded-md"
                type="text"
                placeholder="Firstname"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstname(e.target.value)}
              />

              <input
                className="mr-4 border-solid border-1 border-black rounded-md"
                type="text"
                placeholder="Lastname"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastname(e.target.value)}
              />
              <input
                className="mr-4 border-solid border-1 border-black rounded-md"
                type="text"
                placeholder="Email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                className="mr-4 border-solid border-1 border-black rounded-md"
                type="text"
                placeholder="Street"
                id="street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />

              <input
                className="mr-4 border-solid border-1 border-black rounded-md"
                type="number"
                placeholder="Number"
                id="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />

              <input
                className="mr-4 border-solid border-1 border-black rounded-md"
                type="number"
                placeholder="Zip"
                id="zip"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
              />

              <button
                className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                Create
              </button>
            </form>
            {errorMessage && (
              <p className="text-red-500 mt-4">{errorMessage}</p>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isClientModalOpen}
        onRequestClose={closeClientModal}
        contentLabel="Create Client Modal"
      >
        <div>
          <div>
            <button
              className="absolute top-0 right-0 m-2 bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded"
              onClick={closeClientModal}
            >
              X
            </button>
            <h1 className="text-center p-11 mb-20">Create client</h1>

            <form className="text-center" onSubmit={handleSubmitClient}>
              <input
                className="mr-4  border-solid border-1 border-black rounded-md"
                type="text"
                placeholder="Name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                className="mr-4  border-solid border-1 border-black rounded-md"
                type="text"
                placeholder="Street"
                id="street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />

              <input
                className="mr-4 border-solid border-1 border-black rounded-md"
                type="text"
                placeholder="Number"
                id="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />

              <input
                className="mr-4  border-solid border-1 border-black rounded-md"
                type="number"
                placeholder="Zip"
                id="zip"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
              />

              <button
                className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                Create
              </button>
            </form>
            {errorMessage && (
              <p className="text-red-500 mt-4">{errorMessage}</p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardAdmin;
