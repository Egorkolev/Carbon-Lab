import type { ViewState } from "react-map-gl/mapbox"

export interface Location {
    unit: string,
    lastMaintenance: string,
    facilityType: string,
    timestamp: number,
    currentReading: number,
    address: string,
    alertLevel: string,
    country: string,
    state: string,
    monitoringEquipment: string,
    operatorCompany: string,
    notes: string,
    gasType: string,
    facilityName: string,
    longitude: number,
    locationId: string,
    latitude: number
}

export interface MapBoxProps {
    setSelectedLocation: (location: Location | null) => void,
    setViewState: (viewState: ViewState & { width: number; height: number }) => void,
    selectedLocation: Location | null,
    locations: Location[],
    viewState: ViewState & { width: number; height: number },
}

export interface MapViewProps {
    locations: Location[],
    selectedLocation: Location | null,
    setSelectedLocation: (location: Location | null) => void,
    viewState: ViewState & { width: number; height: number },
    setViewState: (viewState: ViewState & { width: number; height: number }) => void,
}

export interface AlertViewProps {
    locations: Location[],
}

export interface MonitoringViewProps {
    selectedLocation: Location | null,
    locations: Location[],
}