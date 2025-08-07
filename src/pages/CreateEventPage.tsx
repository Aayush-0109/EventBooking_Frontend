import React from 'react';
import Container from '../components/layout/Container';
import { CreateEventForm } from '../components/features/CreateEventForm';

export const CreateEventPage: React.FC = () => {
    const handleSubmit = async (data: any) => {
        // Mock API call
        console.log('Event creation data:', data);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock success response
        alert('Event created successfully! Your event is now live on the platform.');
    };

    const handleCancel = () => {
        // Mock navigation back
        alert('Event creation cancelled');
    };

    return (
        <Container>
            <div className="py-8">
                <CreateEventForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </div>
        </Container>
    );
}; 