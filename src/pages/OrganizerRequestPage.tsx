import React from 'react';
import Container from '../components/layout/Container';
import { OrganizerRequestForm } from '../components/features/OrganizerRequestForm';

export const OrganizerRequestPage: React.FC = () => {
    const handleSubmit = async (data: { overview: string; resume: File | null }) => {
        // Mock API call
        console.log('Organizer request data:', data);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock success response
        alert('Organizer request submitted successfully! We will review your application and get back to you within 3-5 business days.');
    };

    const handleCancel = () => {
        // Mock navigation back
        alert('Application cancelled');
    };

    return (
        <Container>
            <div className="py-8">
                <OrganizerRequestForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </div>
        </Container>
    );
};