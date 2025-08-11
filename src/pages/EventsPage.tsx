import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import EventCard from '../components/features/EventCard';
import { useAuthStore } from '../store/authStore';
import { classifyError } from '../utils/errorHandling';
import { message } from 'antd';
const events : any = []
const EventsPage: React.FC = () => {
    const [loading] = useState(false);
    const navigate = useNavigate();
let response;
    
    useEffect(() => {
      ( async ()=>{
        try {
            response = await api.get('/events')
            message.success(response.message);
        } catch (error) {
           const classifiedError =  classifyError(error)
           message.error(classifiedError.message);
           console.log(classifiedError.technicalMessage)
        }
      })()
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-neutral-800">All Events</h1>
                    <p className="text-neutral-600 mt-2">Discover amazing events happening around you</p>
                </div>
                <Button variant="primary" onClick={() => navigate('/create-event')}>Create Event</Button>
            </div>
            {/* Events Grid */}
            {loading ? (
                <div>Loading events...</div>
            ) : events.length === 0 ? (
                <div>No events found.</div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map(event : any => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventsPage;