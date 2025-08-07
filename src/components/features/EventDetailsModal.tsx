import React from 'react';
import { X, Calendar, MapPin, Users, Clock, Tag } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Event } from '../../types';

interface EventDetailsModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onRegister: (eventId: string) => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  isOpen,
  onClose,
  onRegister
}) => {
  if (!event) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Event Details">
      <div className="space-y-6">
        {/* Event Image */}
        <div className="relative h-64 rounded-lg overflow-hidden">
          <img
            src={event.images?.[0] || '/placeholder-event.jpg'}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${event.status === 'active'
                ? 'bg-success-100 text-success-700'
                : 'bg-warning-100 text-warning-700'
              }`}>
              {event.status}
            </span>
          </div>
        </div>

        {/* Event Title & Description */}
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            {event.title}
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Event Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-primary-500" />
            <div>
              <p className="text-sm text-neutral-500">Date & Time</p>
              <p className="font-medium text-neutral-900">
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-primary-500" />
            <div>
              <p className="text-sm text-neutral-500">Time</p>
              <p className="font-medium text-neutral-900">
                {new Date(event.date).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-primary-500" />
            <div>
              <p className="text-sm text-neutral-500">Location</p>
              <p className="font-medium text-neutral-900">
                {event.location}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-primary-500" />
            <div>
              <p className="text-sm text-neutral-500">Attendees</p>
              <p className="font-medium text-neutral-900">
                {event.registrations?.length || 0} registered
              </p>
            </div>
          </div>
        </div>

        {/* Category */}
        {event.category && (
          <div className="flex items-center space-x-3">
            <Tag className="w-5 h-5 text-primary-500" />
            <div>
              <p className="text-sm text-neutral-500">Category</p>
              <p className="font-medium text-neutral-900">
                {event.category}
              </p>
            </div>
          </div>
        )}

        {/* Organizer Info */}
        <div className="border-t pt-4">
          <h3 className="font-semibold text-neutral-900 mb-2">Organized by</h3>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-600 font-semibold">
                {event.organizer?.name?.charAt(0) || 'O'}
              </span>
            </div>
            <div>
              <p className="font-medium text-neutral-900">
                {event.organizer?.name || 'Unknown Organizer'}
              </p>
              <p className="text-sm text-neutral-500">
                {event.organizer?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4 border-t">
          <Button
            onClick={() => onRegister(event.id)}
            className="flex-1"
            size="lg"
          >
            Register for Event
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            size="lg"
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}; 