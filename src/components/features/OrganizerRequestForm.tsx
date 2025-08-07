import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../ui/Button';
import Input from '../ui/Input';
import LoadingSpinner from '../ui/LoadingSpinner';
import { FileText, Upload, X, Building, User } from 'lucide-react';

// Organizer request schema matching backend exactly
const organizerRequestSchema = z.object({
    overview: z.string()
        .min(5, "Overview must be at least 5 characters")
        .max(100, "Overview cannot exceed 100 characters")
        .trim()
});

type OrganizerRequestFormData = z.infer<typeof organizerRequestSchema>;

interface OrganizerRequestFormProps {
    onSubmit: (data: OrganizerRequestFormData & { resume: File | null }) => Promise<void>;
    onCancel: () => void;
}

export const OrganizerRequestForm: React.FC<OrganizerRequestFormProps> = ({ onSubmit, onCancel }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedResume, setSelectedResume] = useState<File | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<OrganizerRequestFormData>({
        resolver: zodResolver(organizerRequestSchema),
        defaultValues: {
            overview: '',
        }
    });

    const handleFormSubmit = async (data: OrganizerRequestFormData) => {
        setIsSubmitting(true);
        try {
            await onSubmit({ ...data, resume: selectedResume });
        } catch (error) {
            console.error('Organizer request failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.includes('pdf') && !file.type.includes('document')) {
                alert('Please upload a PDF or document file');
                return;
            }
            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }
            setSelectedResume(file);
        }
    };

    const removeResume = () => {
        setSelectedResume(null);
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-neutral-900 mb-2 flex items-center">
                    <Building className="w-6 h-6 mr-2" />
                    Apply to Become an Organizer
                </h2>
                <p className="text-neutral-600">
                    Submit your application to start creating and managing events on our platform
                </p>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                {/* Overview Section */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Overview
                    </label>
                    <textarea
                        {...register('overview')}
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            errors.overview ? 'border-error-500' : 'border-neutral-300'
                        }`}
                        placeholder="Tell us about your experience and why you want to become an organizer (5-100 characters)"
                        maxLength={100}
                    />
                    {errors.overview && (
                        <p className="mt-1 text-sm text-error-600">{errors.overview.message}</p>
                    )}
                    <p className="mt-1 text-sm text-neutral-500">
                        {watch('overview')?.length || 0}/100 characters
                    </p>
                </div>

                {/* Resume Upload Section */}
                <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Resume/CV (Optional)
                    </h3>
                    
                    <div className="space-y-4">
                        {!selectedResume ? (
                            <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleResumeUpload}
                                    className="hidden"
                                    id="resume-upload"
                                />
                                <label htmlFor="resume-upload" className="cursor-pointer">
                                    <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                                    <p className="text-neutral-600">Click to upload resume</p>
                                    <p className="text-sm text-neutral-500">PDF, DOC, DOCX up to 5MB</p>
                                </label>
                            </div>
                        ) : (
                            <div className="border border-neutral-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <FileText className="w-5 h-5 text-primary-600" />
                                        <div>
                                            <p className="font-medium text-neutral-900">{selectedResume.name}</p>
                                            <p className="text-sm text-neutral-500">
                                                {(selectedResume.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removeResume}
                                        className="text-error-500 hover:text-error-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Information Section */}
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                    <h4 className="font-medium text-primary-900 mb-2 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        What happens next?
                    </h4>
                    <ul className="text-sm text-primary-800 space-y-1">
                        <li>• Your application will be reviewed by our team</li>
                        <li>• We'll contact you within 3-5 business days</li>
                        <li>• Once approved, you can start creating events</li>
                        <li>• You'll have access to organizer dashboard and tools</li>
                    </ul>
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
                                Submitting Application...
                            </>
                        ) : (
                            'Submit Application'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}; 