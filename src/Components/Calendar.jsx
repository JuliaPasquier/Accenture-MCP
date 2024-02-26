import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { user } from '@nextui-org/react';

function Calendar() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [workLocation, setWorkLocation] = useState('');
    const [destinations, setDestinations] = useState([]);
    const userId = localStorage.getItem('userId'); // Récupérer l'ID du user du localStorage
    const [events, setEvents] = useState([]);


    // Ajoutez plus d'événements  ici...


    // // Récupérer les événements du calendrier de l'utilisateur

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = () => {
        fetch(`https://api-accenture.vercel.app/users/${userId}/calendar/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(),
          })
            .then(response => response.json())
            .then(data => {
                console.log('Events:', data);
                const formattedEvents = data.calendar.map((event) => ({
                    title: event.locationName,
                    start: new Date(event.dayDate),
                    end: new Date(event.dayDate),
                    color: getColorByLocation(event.locationName),
                    textColor: 'black'
                }));
                setEvents(formattedEvents);
            })
            .catch(error => console.error('Error fetching events:', error));
    };


    const getColorByLocation = (locationName) => {
        switch (locationName) {
            case 'Home':
                return 'orange';
            case 'Office':
                return 'yellow';
            default:
                return 'blue';
        }
    };



    // /// Fonction pour récupérer les destinations (n'afficher que les noms)

    useEffect(() => {
        fetchDestinations();
    }, []);

    const fetchDestinations = () => {
        fetch('https://api-accenture-3y3u.vercel.app/destination')
            .then(response => response.json())
            .then(data => {
                const namesAndIds = data.map(item => ({
                    name: item.name,
                    id: item._id
                }));
                console.log('Destinations:', namesAndIds);
                setDestinations(namesAndIds);
            })
            .catch(error => console.error('Error fetching destinations:', error));
    };

    const handleDateClick = (info) => {
        setSelectedDate(info.dateStr);
    };

    const handleWorkLocationChange = (event) => {
        setWorkLocation(event.target.value);
    };

    const handleValidation = () => {
        console.log('Selected date:', selectedDate);
        if (!selectedDate) {
            console.error('No date selected');
            return;
        }
        if (!workLocation || !destinations.find(dest => dest.id === workLocation)) {
            console.log('Invalid work location selected');
            return;
        }

        const selectedDestination = destinations.find(dest => dest.id === workLocation).id;
        const dayDate = new Date(selectedDate).toISOString();

        const data = {
            dayDate,
            _destination: selectedDestination,
            isEligible: false // par defaut, l'utilisateur n'est pas éligible
        };


        console.log('Data to be sent:', data);


        //poster un événement dans le calendrier de l'utilisateur
        if (userId) {
            fetch(`https://api-accenture.vercel.app/users/${userId}/calendar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(responseData => {
                    console.log('POST request successful:', responseData);
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Error while making POST request:', error);
                });
        } else {
            console.error('User ID not found in localStorage');
        }
    };



    return (
        <div className="container mx-auto">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                selectable={true}
                dateClick={handleDateClick}
                dayCellContent={(arg) => arg.dayNumberText}
                events={events}
            />

            {selectedDate && (
                <div>
                    <h5>{selectedDate}</h5>
                    {destinations.length > 0 && (
                        <div>
                            <h5>Selected Work Location:</h5>
                            <select className="order-2 border-solid border-black text-center mr-6" value={workLocation} onChange={handleWorkLocationChange}>
                                <option value="" disabled selected>Choose a location</option>
                                {destinations.map(dest => (
                                    <option key={dest.id} value={dest.id} className="border-solid border-black">{dest.name}</option>
                                ))}
                            </select>
                            <button className="ml-[6px] bg-purple-800 hover:bg-purple-600 text-white p-2 rounded-md mt-6" onClick={handleValidation}>Validate</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Calendar;
