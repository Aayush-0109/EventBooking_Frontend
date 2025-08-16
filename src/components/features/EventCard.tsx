import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin} from 'lucide-react';
import { Event } from '../../services';
import { formatDate } from '../../lib/utils';
import Button from '../ui/Button';

interface EventCardProps {
    event: Event;
    onBook?: (eventId: number) => void;
    loading?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
    event,
    onBook,
    loading = false
}) => {
    return (
        <div className="bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-medium transition-shadow">
            {/* Event Image */}
            <div className="h-48 bg-gradient-to-br from-primary-200 to-primary-300 flex items-center justify-center">
                {event.images && !Array.isArray(event.images) ? (
                    <img
                        src={event.images}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <Calendar className="w-12 h-12 text-primary-600" />
                )}
            </div>

            {/* Event Details */}
            <div className="p-6 space-y-4">
                <div>
                    <h3 className="text-xl font-semibold text-neutral-800 mb-2 line-clamp-2">
                        {event.title}
                    </h3>
                    <p className="text-neutral-600 text-sm line-clamp-2">
                        {event.description}
                    </p>
                </div>

                {/* Event Info */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <MapPin className="w-4 h-4" />
                        <span>{event.city}, {event.state}</span>
                    </div>
                    {/* <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <Users className="w-4 h-4" />
                        <span>{event.registrations?.length || 0} attendees</span>
                    </div> */}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Link
                        to={`/events/${event.id}`}
                        className="flex-1"
                    >
                        <Button variant="outline" className="w-full">
                            View Details
                        </Button>
                    </Link>
                    <Button
                        variant="primary"
                        className="flex-1"
                        onClick={() => onBook?.(event.id)}
                        loading={loading}
                    >
                        Book Now
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EventCard; 