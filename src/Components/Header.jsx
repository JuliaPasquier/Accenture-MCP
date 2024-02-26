import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const Header = () => {
    const location = useLocation();

    if (location.pathname === "/login") {
        return (
            <header className="bg-purple-950">
                <div className="container mx-auto px-4 py-6">
                    <div className="text-white text-4xl font-bold">FMB</div>
                </div>
            </header>
        );
    }

    if (location.pathname === "/") {
        return (
            <header className="bg-purple-800">
                <div className="container mx-auto px-4 py-6">
                    <div className="text-white text-4xl font-bold">FMB</div>
                </div>
            </header>
        );
    }

    return (
        <header className="bg-purple-800">
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between">
                    <div className="text-white text-4xl font-bold">FMB</div>
                    <nav className="space-x-4 uppercase">
                    <i className='bx bx-log-out'></i>
                        <Link
                            to="/"
                            className="text-white hover:text-gray-300 no-underline"
                        >
                            Logout
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
