import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../ui/Button';
import Input from '../ui/Input';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Calendar, MapPin } from 'lucide-react';
import useEventStore from '../../store/eventStore';
import { Event } from '../../services';
import { isDevelopment } from '../../config/environment';

// Form validation schema for updates (all fields optional)
const updateEventFormSchema = z.object({
  title: z.string()
    .min(3, "Title must have at least 3 characters")
    .max(100, "Title cannot exceed 100 characters")
    .trim()
    .optional(),
  description: z.string()
    .min(10, "Description must have at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters")
    .trim()
    .optional(),
  date: z
    .string()
    .min(1, "Date is required")
    .refine(date => new Date(date) > new Date(), "Event date must be in future")
    .optional(),
  longitude: z.number()
    .min(-180, "Invalid longitude")
    .max(180, "Invalid longitude")
    .optional(),
  latitude: z.number()
    .min(-85.05112878, "Invalid latitude")
    .max(85.05112878, "Invalid latitude")
    .optional(),
  address: z.string().min(5, "Complete address is required").optional(),
  city: z.string().min(2, "City is required").optional(),
  state: z.string().min(2, "State/Province is required").optional(),
  country: z.string().min(2, "Country is required").optional(),
  postalCode: z.string().min(3, "Postal code is required").optional(),
}).refine(data => {
  // At least one field must be provided
  const hasAnyField = Object.values(data).some(value => value !== undefined && value !== '');

  // If updating location, all address fields must be provided together
  const addressFields = [data.address, data.city, data.state, data.country, data.postalCode];
  const hasAnyAddressField = addressFields.some(field => field !== undefined && field !== '');
  const hasAllAddressFields = addressFields.every(field => field !== undefined && field !== '');

  // If updating coordinates, both must be provided
  const hasAnyGeoField = data.longitude !== undefined || data.latitude !== undefined;
  const hasAllGeoFields = data.longitude !== undefined && data.latitude !== undefined;

  if (hasAnyAddressField && !hasAllAddressFields) {
    return false;
  }
  if (hasAnyGeoField && !hasAllGeoFields) {
    return false;
  }

  return hasAnyField;
}, "At least one field must be provided. If updating location, all address fields must be provided together. If updating coordinates, both latitude and longitude must be provided.");

type UpdateEventFormData = z.infer<typeof updateEventFormSchema>;

interface UpdateEventFormProps {
  event: Event;
  onSubmit: (data: UpdateEventFormData) => Promise<void>;
  onCancel: () => void;
}

export const UpdateEventForm: React.FC<UpdateEventFormProps> = ({ event, onSubmit, onCancel }) => {
  const { isMutating, error, clearError } = useEventStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UpdateEventFormData>({
    resolver: zodResolver(updateEventFormSchema),
    defaultValues: {
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().slice(0, 16), // Format for datetime-local input
      longitude: event.longitude,
      latitude: event.latitude,
      address: event.address,
      city: event.city,
      state: event.state,
      country: event.country,
      postalCode: event.postalCode,
    }
  });

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleFormSubmit = async (data: UpdateEventFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      if (isDevelopment()) {
        console.error('Event update failed:', error);
      }
    }
  };

  const handleLocationSelect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('latitude', position.coords.latitude);
          setValue('longitude', position.coords.longitude);
        },
        () => {
          // Fallback to default coordinates
          setValue('latitude', 40.7128);
          setValue('longitude', -74.0060);
        }
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Update Event</h2>
        <p className="text-neutral-600">Modify the fields you want to update. Leave fields unchanged to keep current values.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <p className="text-red-700">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearError}
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Event Title"
              {...register('title')}
              error={errors.title?.message}
              placeholder="Enter event title (3-100 characters)"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.description ? 'border-error-500' : 'border-neutral-300'
                }`}
              placeholder="Describe your event (10-1000 characters)"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-error-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <Input
              label="Event Date & Time"
              type="datetime-local"
              {...register('date')}
              error={errors.date?.message}
              leftIcon={Calendar}
            />
          </div>
        </div>

        {/* Location Information */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Location Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Address"
                {...register('address')}
                error={errors.address?.message}
                placeholder="Complete street address"
              />
            </div>

            <div>
              <Input
                label="City"
                {...register('city')}
                error={errors.city?.message}
                placeholder="City name"
              />
            </div>

            <div>
              <Input
                label="State/Province"
                {...register('state')}
                error={errors.state?.message}
                placeholder="State or province"
              />
            </div>

            <div>
              <Input
                label="Country"
                {...register('country')}
                error={errors.country?.message}
                placeholder="Country name"
              />
            </div>

            <div>
              <Input
                label="Postal Code"
                {...register('postalCode')}
                error={errors.postalCode?.message}
                placeholder="Postal/ZIP code"
              />
            </div>

            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleLocationSelect}
                className="w-full"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Use Current Location
              </Button>
            </div>
          </div>

          {/* Coordinates Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Latitude
              </label>
              <Input
                type="number"
                step="any"
                {...register('latitude', { valueAsNumber: true })}
                error={errors.latitude?.message}
                placeholder="Latitude (e.g., 40.7128)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Longitude
              </label>
              <Input
                type="number"
                step="any"
                {...register('longitude', { valueAsNumber: true })}
                error={errors.longitude?.message}
                placeholder="Longitude (e.g., -74.0060)"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isMutating}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isMutating}
            disabled={isMutating}
          >
            {isMutating ? (
              <>
                <LoadingSpinner size="sm" />
                Updating Event...
              </>
            ) : (
              'Update Event'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
