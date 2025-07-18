"use client";

import { MonitoringTable } from "@/compnents/monitoring-table";
import { Location, type ViewContainerProps } from "./types";
import { AlertsPanel } from "@/compnents/alert-panel";
import type { ViewState } from "react-map-gl/mapbox";
import { MapView } from "@/compnents/map.view";
import { Header } from "@/compnents/header";
import { useEffect, useState } from "react";

export default function ViewContainer({ locations }: ViewContainerProps) {
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [viewState, setViewState] = useState<ViewState & { width: number; height: number }>({
        longitude: -100.0,
        latitude: 45.0,
        zoom: 2,
        bearing: 0,
        pitch: 0,
        width: 800,
        height: 600,
        padding: { top: 0, left: 0, bottom: 0, right: 0 },
    });

    useEffect(() => {
        if (selectedLocation) {
            setViewState({
                ...viewState,
                longitude: selectedLocation.longitude,
                latitude: selectedLocation.latitude,
                zoom: 4,
            });
        }
    }, [selectedLocation]);
    return (
        <div>
            <Header locationsQuantity={locations.length} />
            <div className="flex gap-4 p-4 w-full justify-between h-[calc(100vh-75px)]">
                <MapView 
                    setSelectedLocation={setSelectedLocation} 
                    locations={locations as Location[]} 
                    selectedLocation={selectedLocation} 
                    setViewState={setViewState}
                    viewState={viewState}
                />
                <div className="flex flex-col gap-4 w-full">
                    <AlertsPanel locations={locations as Location[]} />
                    <MonitoringTable 
                        selectedLocation={selectedLocation}
                        locations={locations as Location[]} 
                    />
                </div>
            </div>
        </div>
    );
}