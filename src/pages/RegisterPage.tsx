import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Container from '../components/layout/Container';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { message } from 'antd'
import { useNavigate } from 'react-router-dom';

// Registration form validation schema matching backend exactly
const registerSchema = z.object({
    name: z.string().min(2).max(50).trim(),
    email: z.string().email().min(1),
    password: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine(val => val === true, {
        message: "You must accept the terms and conditions"
    })
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate()
    const { registerUser, setLoading, error, clearError, isLoading } = useAuthStore()
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
    useEffect(() => {
        clearError()
    }, [clearError])
    const handleFormSubmit = async (data: RegisterFormData) => {

        try {
            const result = await registerUser(data.name, data.email, data.password);
            if (result.success) {
                message.success(result.message || "Registration successful")
                clearError()
                const user = result.user;
                if (user?.role === "ADMIN") navigate("/admin")
                else if (user?.role === "ORGANIZER") navigate("organizer/dashboard");
                else navigate('/dashboard')
            }
            else message.error(result.message || "Regustration failed")

        } catch (error: any) {
            const errorMsg = error.originalError?.response?.data?.message
                || error.message
                || "Registration failed";
            message.error(errorMsg);

        };
    }
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

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

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
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
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
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
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
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            {isLoading ? (
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