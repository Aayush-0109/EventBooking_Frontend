import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Container from '../components/layout/Container';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

// Registration form validation schema matching backend exactly
const registerSchema = z.object({
    name: z.string()
        .min(2, "Name must have at least 2 characters")
        .max(50, "Name cannot exceed 50 characters")
        .trim(),
    email: z.string()
        .email("Invalid email format")
        .min(1, "Email is required"),
    password: z.string()
        .min(8, "Minimum 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        }
    });

    const handleFormSubmit = async (data: RegisterFormData) => {
        setIsSubmitting(true);
        try {
            // TODO: Integrate with backend API
            console.log('Registration data:', data);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // TODO: Handle successful registration
            console.log('Registration successful!');
        } catch (error) {
            console.error('Registration failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container>
            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                            Create your account
                        </h2>
                        <p className="text-neutral-600">
                            Join us to discover and book amazing events
                        </p>
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                        {/* Personal Information */}
                        <div className="space-y-4">
                            <Input
                                label="Full Name"
                                {...register('name')}
                                error={errors.name?.message}
                                leftIcon={User}
                                placeholder="Enter your full name"
                                required
                            />

                            <Input
                                label="Email Address"
                                type="email"
                                {...register('email')}
                                error={errors.email?.message}
                                leftIcon={Mail}
                                placeholder="Enter your email address"
                                required
                            />
                        </div>

                        {/* Password Fields */}
                        <div className="space-y-4">
                            <div className="relative">
                                <Input
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password')}
                                    error={errors.password?.message}
                                    leftIcon={Lock}
                                    placeholder="Create a password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            <div className="relative">
                                <Input
                                    label="Confirm Password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    {...register('confirmPassword')}
                                    error={errors.confirmPassword?.message}
                                    leftIcon={Lock}
                                    placeholder="Confirm your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Password Requirements */}
                        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                            <h4 className="font-medium text-neutral-900 mb-2">Password Requirements:</h4>
                            <ul className="text-sm text-neutral-600 space-y-1">
                                <li>• Minimum 8 characters</li>
                                <li>• At least one uppercase letter (A-Z)</li>
                                <li>• At least one lowercase letter (a-z)</li>
                                <li>• At least one number (0-9)</li>
                            </ul>
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
                                and{' '}
                                <a href="#" className="text-primary-600 hover:text-primary-700 underline">
                                    privacy policy
                                </a>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            loading={isSubmitting}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <LoadingSpinner size="sm" />
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </Button>
                    </form>

                    {/* Login Link */}
                    <div className="text-center">
                        <p className="text-sm text-neutral-600">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="font-medium text-primary-600 hover:text-primary-700"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </Container>
    );
}; 