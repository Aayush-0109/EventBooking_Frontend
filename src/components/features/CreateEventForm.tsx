import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../ui/Button';
import Input from '../ui/Input';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Calendar, MapPin, FileText, Upload, X } from 'lucide-react';

// Form validation schema (for React Hook Form)
const createEventFormSchema = z.object({
  title: z.string()
    .min(3, "Title must have at least 3 characters")
    .max(100, "Title cannot exceed 100 characters")
    .trim(),
  description: z.string()
    .min(10, "Description must have at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters")
    .trim(),
  date: z
    .string()
    .min(1, "Date is required")
    .refine(date => new Date(date) > new Date(), "Event date must be in future"),
  longitude: z.number()
    .min(-180, "Invalid longitude")
    .max(180, "Invalid longitude"),
  latitude: z.number()
    .min(-85.05112878, "Invalid latitude")
    .max(85.05112878, "Invalid latitude"),
  address: z.string().min(5, "Complete address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State/Province is required"),
  country: z.string().min(2, "Country is required"),
  postalCode: z.string().min(3, "Postal code is required"),
});

// Backend validation schema (matches backend exactly)
const createEventSchema = z.object({
  title: z.string()
    .min(3, "Title must have at least 3 characters")
    .max(100, "Title cannot exceed 100 characters")
    .trim(),
  description: z.string()
    .min(10, "Description must have at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters")
    .trim(),
  date: z
    .string()
    .datetime("Invalid date format, use ISO string")
    .transform(date => new Date(date))
    .refine(date => date > new Date(), "Event date must be in future"),
  longitude: z.number()
    .min(-180, "Invalid longitude")
    .max(180, "Invalid longitude"),
  latitude: z.number()
    .min(-85.05112878, "Invalid latitude")
    .max(85.05112878, "Invalid latitude"),
  address: z.string().min(5, "Complete address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State/Province is required"),
  country: z.string().min(2, "Country is required"),
  postalCode: z.string().min(3, "Postal code is required"),
});

// Raw form data type (what the form actually handles)
type CreateEventFormData = {
  title: string;
  description: string;
  date: string;
  longitude: number;
  latitude: number;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

// Validated data type (after schema validation)
type ValidatedEventData = z.infer<typeof createEventSchema>;

interface CreateEventFormProps {
  onSubmit: (data: ValidatedEventData) => Promise<void>;
  onCancel: () => void;
}

export const CreateEventForm: React.FC<CreateEventFormProps> = ({ onSubmit, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventFormSchema),
    defaultValues: {
      title: '',
      description: '',
      date: '',
      longitude: 0,
      latitude: 0,
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    }
  });

  const handleFormSubmit = async (data: CreateEventFormData) => {
    setIsSubmitting(true);
    try {
      // Validate the data using the schema
      const validatedData = createEventSchema.parse(data);
      await onSubmit(validatedData);
    } catch (error) {
      console.error('Event creation failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleLocationSelect = () => {
    // Mock location selection - in real app, this would open a map picker
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
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Create New Event</h2>
        <p className="text-neutral-600">Fill in the details below to create your event</p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Event Title"
              {...register('title')}
              error={errors.title?.message}
              placeholder="Enter event title (3-100 characters)"
              required
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
              required
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
                required
              />
            </div>

            <div>
              <Input
                label="City"
                {...register('city')}
                error={errors.city?.message}
                placeholder="City name"
                required
              />
            </div>

            <div>
              <Input
                label="State/Province"
                {...register('state')}
                error={errors.state?.message}
                placeholder="State or province"
                required
              />
            </div>

            <div>
              <Input
                label="Country"
                {...register('country')}
                error={errors.country?.message}
                placeholder="Country name"
                required
              />
            </div>

            <div>
              <Input
                label="Postal Code"
                {...register('postalCode')}
                error={errors.postalCode?.message}
                placeholder="Postal/ZIP code"
                required
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

        {/* Image Upload */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Event Images
          </h3>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <p className="text-neutral-600">Click to upload images</p>
                <p className="text-sm text-neutral-500">PNG, JPG, JPEG up to 5MB each</p>
              </label>
            </div>

            {selectedImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {selectedImages.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-error-500 text-white rounded-full p-1 hover:bg-error-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" />
                Creating Event...
              </>
            ) : (
              'Create Event'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}; 