import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';

const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Events', href: '/events' },
    { label: 'Login', href: '/login' },
];

const Header: React.FC = () => {
    return (
        <header className="w-full bg-white shadow-soft py-4 px-6 flex items-center justify-between">
            {/* Logo / App Name */}
            <Link to="/" className="text-2xl font-heading font-bold text-primary-600 tracking-tight">
                EventBooking
            </Link>
            {/* Navigation */}
            <nav className="flex gap-6">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                            "text-base font-medium text-neutral-700 hover:text-primary-600 transition-colors"
                        )}
                    >
                        {item.label}
                    </Link>
                ))}
                <Button onClick={() => alert('Logout logic goes here')} variant="danger" size="sm">
                    Logout
                </Button>
            </nav>
        </header>
    );
};

export default Header;