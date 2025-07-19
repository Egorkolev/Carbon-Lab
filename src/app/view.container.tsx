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
    const [filteredLocationsList, setFilteredLocationsList] = useState<Location[]>(locations);
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

    const handleSearch = (value: string) => {
        const filteredLocation = locations.filter((location) => {
            return location.facilityName.toLowerCase().includes(value.toLowerCase()) ||
            location.monitoringEquipment.toLowerCase().includes(value.toLowerCase()) ||
            location.operatorCompany.toLowerCase().includes(value.toLowerCase()) ||
            location.gasType.toLowerCase().includes(value.toLowerCase()) ||
            location.state.toLowerCase().includes(value.toLowerCase()) ||
            location.notes.toLowerCase().includes(value.toLowerCase()) ||
            location.address.toLowerCase().includes(value.toLowerCase()) ||
            location.country.toLowerCase().includes(value.toLowerCase()) ||
            location.currentReading.toString().includes(value.toLowerCase()) ||
            location.alertLevel.toLowerCase().includes(value.toLowerCase()) ||
            location.facilityType.toLowerCase().includes(value.toLowerCase()) ||
            location.unit.toLowerCase().includes(value.toLowerCase())
        });
        setFilteredLocationsList(filteredLocation);
    };

    return (
        <div>
            <Header 
                locationsQuantity={locations.length}
                handleSearch={handleSearch}
            />
            <div className="flex flex-wrap gap-4 p-4 w-full justify-between">
                <div className="w-full flex flex-[1_1_500px] md:h-[calc(100vh-100px)]">
                    <MapView
                        filteredLocationsList={filteredLocationsList}
                        setSelectedLocation={setSelectedLocation} 
                        locations={locations as Location[]} 
                        selectedLocation={selectedLocation} 
                        setViewState={setViewState}
                        viewState={viewState}
                    />
                </div>
                <div className="flex flex-[1_1_500px] flex-col gap-4 w-full md:h-[calc(100vh-100px)]">
                    <MonitoringTable 
                        selectedLocation={selectedLocation}
                        locations={locations as Location[]} 
                    />
                    <AlertsPanel locations={locations as Location[]} />
                </div>
            </div>
        </div>
    );
}
