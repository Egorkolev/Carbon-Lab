"use client";
import { CheckCircle } from "lucide-react";
import { Search } from "lucide-react";

interface HeaderProps {
    locationsQuantity: number;
    handleSearch: (value: string) => void;
}

export function Header({ locationsQuantity, handleSearch }: HeaderProps) {
    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Environmental Monitoring Dashboard
                    </h1>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <p className="text-sm font-medium text-gray-600">
                            Active Monitoring Station
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                            {locationsQuantity}
                        </p>
                    </div>
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search facilities..."
                            onChange={(e) => handleSearch(e.target.value)}
                            className="text-gray-900 pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
