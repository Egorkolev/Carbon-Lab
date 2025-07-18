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

export interface ViewContainerProps {
    locations: Location[],
}