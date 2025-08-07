import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import LoadingSpinner from '../ui/LoadingSpinner';
import { User, Calendar, MapPin } from 'lucide-react';

// Registration form validation schema
const registrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  dietaryRestrictions: z.string().optional(),
  specialRequests: z.string().optional(),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface RegistrationFormProps {
  event: {
    id: string;
    title: string;
    date: string;
    location: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RegistrationFormData) => Promise<void>;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  event,
  isOpen,
  onClose,
  onSubmit
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      dietaryRestrictions: '',
      specialRequests: '',
    }
  });

  const handleFormSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!event) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register for Event">
      <div className="space-y-6">
        {/* Event Summary */}
        <div className="bg-primary-50 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-primary-900">{event.title}</h3>
          <div className="flex items-center space-x-3 text-sm text-primary-700">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(event.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-primary-700">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            {...register('name')}
            error={errors.name?.message}
            leftIcon={<User className="w-4 h-4" />}
            placeholder="Enter your full name"
            required
          />

          <Input
            label="Email Address"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            placeholder="Enter your email address"
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            {...register('phone')}
            error={errors.phone?.message}
            placeholder="Enter your phone number"
            required
          />

          <Input
            label="Dietary Restrictions (Optional)"
            {...register('dietaryRestrictions')}
            error={errors.dietaryRestrictions?.message}
            placeholder="e.g., Vegetarian, Gluten-free, etc."
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Special Requests (Optional)
            </label>
            <textarea
              {...register('specialRequests')}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              placeholder="Any special requests or accommodations needed..."
            />
            {errors.specialRequests && (
              <p className="mt-1 text-sm text-error-600">
                {errors.specialRequests.message}
              </p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="terms"
              required
              className="mt-1 w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="terms" className="text-sm text-neutral-600">
              I agree to the{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700 underline">
                terms and conditions
              </a>{' '}
              and confirm that all information provided is accurate.
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              className="flex-1"
              size="lg"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  Registering...
                </>
              ) : (
                'Complete Registration'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              size="lg"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}; 