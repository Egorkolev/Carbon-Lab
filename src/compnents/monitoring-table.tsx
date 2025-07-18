import { MoreHorizontal, MapPin, Building2, Thermometer, Clock, AlertTriangle, Globe, MapPinHouse, Wrench, User, FileText, Zap, Calendar } from "lucide-react";
import type { MonitoringViewProps } from "./types";

const getAlertBadge = (level: "normal" | "elevated" | "high") => {
    const styles = {
        normal: "bg-green-100 text-green-800",
        elevated: "bg-yellow-100 text-yellow-800",
        high: "bg-red-100 text-red-800",
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[level]}`}
        >
            {level.charAt(0).toUpperCase() + level.slice(1)}
        </span>
    );
};

export function MonitoringTable({
    locations,
    selectedLocation,
}: MonitoringViewProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-h-[calc(100vh-65%)]">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                    Station Details
                </h3>
            </div>
            <div className="p-6 pb-20 max-h-full overflow-y-auto">
                <div className="space-y-4">
                    {!selectedLocation ? (
                        locations.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-sm text-gray-900">
                                            {item.facilityName}
                                        </span>
                                        <div className="flex items-center space-x-2">
                                            {getAlertBadge(
                                                item.alertLevel as
                                                    | "normal"
                                                    | "elevated"
                                                    | "high"
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {item.locationId} • {item.gasType}:{" "}
                                        {item.currentReading}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        {item.timestamp}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200 mb-3">
                                <div className="flex items-center space-x-2">
                                    <Building2 className="w-5 h-5 text-blue-600" />
                                    <span className="font-semibold text-blue-900">
                                        {selectedLocation.facilityName}
                                    </span>
                                </div>
                                {getAlertBadge(
                                    selectedLocation.alertLevel as
                                        | "normal"
                                        | "elevated"
                                        | "high"
                                )}
                            </div>

                            {/* Location Info - Flex Layout */}
                            <div className="flex flex-col gap-2 flex-1">
                                <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                                    <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <div className="text-sm min-w-0">
                                        <span className="font-medium text-gray-500">{selectedLocation.locationId}</span>
                                        <span className="text-gray-500 ml-2">• {selectedLocation.address}</span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                                    <Globe className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <div className="text-sm">
                                        <span className="font-medium text-gray-500">{selectedLocation.state}, {selectedLocation.country}</span>
                                    </div>
                                </div>

                                {/* Gas Reading */}
                                <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                                    <Thermometer className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <div className="text-sm">
                                        <span className="font-medium text-gray-500">{selectedLocation.gasType}: {selectedLocation.currentReading} {selectedLocation.unit}</span>
                                    </div>
                                </div>

                                {/* Facility Type */}
                                <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                                    <Building2 className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <div className="text-sm">
                                        <span className="font-medium text-gray-500">Type:</span>
                                        <span className="text-gray-500 ml-2">{selectedLocation.facilityType}</span>
                                    </div>
                                </div>

                                {/* Operator */}
                                <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                                    <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <div className="text-sm">
                                        <span className="font-medium text-gray-500">Operator:</span>
                                        <span className="text-gray-500 ml-2">{selectedLocation.operatorCompany}</span>
                                    </div>
                                </div>

                                {/* Equipment */}
                                <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                                    <Wrench className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <div className="text-sm">
                                        <span className="font-medium text-gray-500">Equipment:</span>
                                        <span className="text-gray-500 ml-2">{selectedLocation.monitoringEquipment}</span>
                                    </div>
                                </div>

                                {/* Last Maintenance */}
                                <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                                    <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <div className="text-sm">
                                        <span className="font-medium text-gray-500">Last Maintenance:</span>
                                        <span className="text-gray-500 ml-2">{selectedLocation.lastMaintenance}</span>
                                    </div>
                                </div>

                                {/* Timestamp */}
                                <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                                    <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <div className="text-sm">
                                        <span className="font-medium text-gray-500">Last Update:</span>
                                        <span className="text-gray-500 ml-2">{new Date(selectedLocation.timestamp).toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Notes */}
                                {selectedLocation.notes && (
                                    <div className="flex items-start space-x-3 p-2 bg-gray-50 rounded">
                                        <FileText className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                        <div className="text-sm">
                                            <span className="font-medium text-gray-500">Notes:</span>
                                            <span className="text-gray-500 ml-2">{selectedLocation.notes}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
