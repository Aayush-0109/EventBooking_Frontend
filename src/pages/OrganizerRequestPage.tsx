import React from 'react';
import Container from '../components/layout/Container';
import { OrganizerRequestForm } from '../components/features/OrganizerRequestForm';
import { message } from 'antd';
import useOrganizerRequestStore from '../store/organizerRequestStore';
import { CreateOrganizerRequestData } from '../services';
import { useNavigate } from 'react-router-dom';
export const OrganizerRequestPage: React.FC = () => {
    const{createRequest} =useOrganizerRequestStore();
    const navigate = useNavigate()
    const handleSubmit = async (data: CreateOrganizerRequestData) => {
        
        console.log('Organizer request data:', data);

        try {
            await createRequest(data)
            message.success("Organizer Request Submitted Successfully")
        } catch (error) {
            
        }
     
        
        
    };

    const handleCancel = () => {
        navigate('/')
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