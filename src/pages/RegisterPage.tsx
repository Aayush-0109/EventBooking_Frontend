import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, XCircle, Camera, Upload, X } from 'lucide-react';
import { message } from 'antd';
import LoadingSpinner from '../components/ui/LoadingSpinner';

import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

import Container from '../components/layout/Container';


import { useAuthStore } from '../store/authStore';
import { RegisterData } from '../services';


const registerSchema = z.object({
    name: z.string().min(2).max(50).trim(),
    email: z.email().min(1),
    password: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine(val => val === true, {
        message: "You must accept the terms and conditions"
    })
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate()
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { registerUser, error, clearError, isLoading, user, isAuthenticated } = useAuthStore()


    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

    const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        }
    });
    const password = watch('password');
    const confirmPassword = watch('confirmPassword');
    useEffect(() => {
        if (confirmPassword && password) {
            setPasswordsMatch(password === confirmPassword)
        }
        else setPasswordsMatch(false)
    }, [password, confirmPassword])

    useEffect(() => {
        clearError()
    }, [clearError])

    useEffect(() => {
        if (isAuthenticated && user) {

            message.success(`Welcome to EventBooking, ${user.name}! 🎉`);
            navigate('/');
        }
    }, [isAuthenticated, user, navigate])

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setImageError(null);

        if (!file) {
            setSelectedImage(undefined);
            setImagePreview(null);
            return;
        }


        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            setImageError('Please select a valid image file (JPG or PNG)');
            return;
        }


        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            setImageError('Image size must be less than 5MB');
            return;
        }


        setSelectedImage(file);

        // Create preview URL
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };


    const removeImage = () => {
        setSelectedImage(undefined);
        setImagePreview(null);
        setImageError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFormSubmit = async (data: RegisterFormData) => {
        if (!passwordsMatch) {
            message.error("Password must match before submitting");
            return
        }
        const userData: RegisterData = {
            name: data.name,
            email: data.email,
            password: data.password,
            profileImage: selectedImage
        }
        await registerUser(userData)
        if (!useAuthStore.getState().error) {
            message.success("Registraition successful!")
            navigate('/login')
        }
    }
    const isFormValid = passwordsMatch && password && confirmPassword;
    return (
        <Container>
            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">

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


                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
                        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">


                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-neutral-700">
                                    Profile Image (Optional)
                                </label>

                                <div className="flex items-center space-x-4">

                                    <div className="relative">
                                        {imagePreview ? (
                                            <div className="relative">

                                                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-neutral-300">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Profile preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md z-10"
                                                    aria-label="Remove image"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-neutral-300 flex items-center justify-center bg-neutral-50">
                                                <Camera className="w-8 h-8 text-neutral-400" />
                                            </div>
                                        )}
                                    </div>


                                    <div className="flex-1">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png"
                                            onChange={handleImageSelect}
                                            className="hidden"
                                            aria-label="Upload profile image"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full"
                                            disabled={isLoading}
                                        >
                                            <Upload className="w-4 h-4 mr-2" />
                                            {selectedImage ? 'Change Image' : 'Upload Image'}
                                        </Button>
                                        <p className="text-xs text-neutral-500 mt-1">
                                            JPG or PNG . Max 5MB.
                                        </p>
                                    </div>
                                </div>


                                {imageError && (
                                    <p className="text-sm text-red-600 flex items-center">
                                        <XCircle className="w-4 h-4 mr-1" />
                                        {imageError}
                                    </p>
                                )}
                            </div>


                            <div className="space-y-4">
                                <Input
                                    label="Full Name"
                                    {...register('name')}
                                    error={errors.name?.message}
                                    leftIcon={User}
                                    placeholder="Enter your full name"
                                    required
                                    disabled={isLoading}
                                />

                                <Input
                                    label="Email Address"
                                    type="email"
                                    {...register('email')}
                                    error={errors.email?.message}
                                    leftIcon={Mail}
                                    placeholder="Enter your email address"
                                    required
                                    disabled={isLoading}
                                />
                            </div>


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
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>

                                <div className="relative">
                                    <Input
                                        label="Confirm Password"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        {...register('confirmPassword', {
                                            onBlur: () => setConfirmPasswordTouched(true)
                                        })}
                                        leftIcon={Lock}
                                        placeholder="Confirm your password"
                                        required
                                        disabled={isLoading}
                                        className={`${confirmPasswordTouched && confirmPassword ?
                                            (passwordsMatch ? 'border-green-300 focus:border-green-500' : 'border-red-300 focus:border-red-500')
                                            : ''
                                            }`}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-10 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>


                                    {confirmPasswordTouched && confirmPassword && (
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            {passwordsMatch ? (
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <XCircle className="w-4 h-4 text-red-500" />
                                            )}
                                        </div>
                                    )}
                                </div>


                                {confirmPasswordTouched && confirmPassword && (
                                    <div className={`text-sm transition-colors ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                                        {passwordsMatch ? (
                                            <span className="flex items-center">
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                Passwords match!
                                            </span>
                                        ) : (
                                            <span className="flex items-center">
                                                <XCircle className="w-4 h-4 mr-1" />
                                                Passwords don't match
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>


                            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                                <h4 className="font-medium text-neutral-900 mb-2">Password Requirements:</h4>
                                <ul className="text-sm text-neutral-600 space-y-1">
                                    <li>• Minimum 8 characters</li>
                                    <li>• At least one uppercase letter (A-Z)</li>
                                    <li>• At least one lowercase letter (a-z)</li>
                                    <li>• At least one number (0-9)</li>
                                </ul>
                            </div>


                            <div className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    {...register('termsAccepted')}
                                    className="mt-1 w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                                    disabled={isLoading}
                                />
                                <div>
                                    <label className="text-sm text-neutral-600">
                                        I agree to the{' '}
                                        <Link
                                            to="/terms"
                                            className="text-primary-600 hover:text-primary-700 underline"
                                            target="_blank"
                                        >
                                            terms and conditions
                                        </Link>{' '}
                                        and{' '}
                                        <Link
                                            to="/privacy"
                                            className="text-primary-600 hover:text-primary-700 underline"
                                            target="_blank"
                                        >
                                            privacy policy
                                        </Link>
                                    </label>
                                    {errors.termsAccepted && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <XCircle className="w-3 h-3 mr-1" />
                                            {errors.termsAccepted.message}
                                        </p>
                                    )}
                                </div>
                            </div>


                            <Button
                                type="submit"
                                className={`w-full transition-all duration-200 ${!isFormValid && !isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                size="lg"
                                loading={isLoading}
                                disabled={isLoading || !isFormValid}
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


                            {!isFormValid && !isLoading && (
                                <p className="text-sm text-neutral-500 text-center">
                                    Please ensure passwords match to continue
                                </p>
                            )}
                        </form>


                        <div className="mt-6 text-center">
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
            </div>
        </Container>
    );
};