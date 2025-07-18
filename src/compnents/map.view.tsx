"use client";

import { MapPin, RotateCcw } from "lucide-react";
import type { MapViewProps } from "./types";
import MapBox from "./mapBox";

const getStatusColor = (status: string) => {
    switch (status) {
    case "normal":
        return "text-green-500";
    case "elevated":
        return "text-yellow-500";
    case "high":
        return "text-red-500";
    }
};

const getStatusBadge = (status: "normal" | "elevated" | "high") => {
    const styles = {
        normal: "bg-green-100 text-green-800",
        elevated: "bg-yellow-100 text-yellow-800",
        high: "bg-red-100 text-red-800",
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
        >
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

export function MapView({
    filteredLocationsList,
    setSelectedLocation,
    selectedLocation,
    setViewState,
    locations,
    viewState,
}: MapViewProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Monitoring Stations Map
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Saguenay, Quebec, Canada
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => {
                            setSelectedLocation(null);
                            setViewState({
                                ...viewState,
                                zoom: 2,
                            });
                        }}
                        className="cursor-pointer inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Refresh
                    </button>
                </div>
            </div>
            <div className="p-6">
                <div className="h-96 w-full bg-gray-100 rounded-lg relative overflow-hidden border border-gray-200">
                    <MapBox
                        setSelectedLocation={setSelectedLocation}
                        selectedLocation={selectedLocation}
                        setViewState={setViewState}
                        locations={locations}
                        viewState={viewState}
                    />
                </div>
                <div className="mt-4 pb-10 space-y-2 max-h-[calc(100vh-620px)] overflow-y-auto">
                    {filteredLocationsList.map((location) => (
                        <div
                            onClick={() => setSelectedLocation(location)}
                            key={location.locationId}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center space-x-3">
                                <MapPin
                                    className={`w-4 h-4 ${getStatusColor(
                                        location.alertLevel
                                    )}`}
                                />
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-gray-900">
                                            {location.facilityName}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            ({location.locationId})
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {location.currentReading}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                {getStatusBadge(
                                    location.alertLevel as
                                        | "normal"
                                        | "elevated"
                                        | "high"
                                )}
                                <div className="text-xs text-gray-500">
                                    {location.latitude.toFixed(4)},{" "}
                                    {location.longitude.toFixed(4)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
