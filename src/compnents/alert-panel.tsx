import { AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";
import type { AlertViewProps } from "./types";

const getAlertIcon = (type: "normal" | "elevated" | "high") => {
    switch (type) {
    case "high":
        return <XCircle className="w-5 h-5 text-red-500" />;
    case "elevated":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    case "normal":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
    }
};

const getAlertBadge = (type: "normal" | "elevated" | "high") => {
    const styles = {
        high: "bg-red-100 text-red-800",
        elevated: "bg-yellow-100 text-yellow-800",
        normal: "bg-green-100 text-green-800",
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[type]}`}
        >
            {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
    );
};

const getAlertBorderColor = (type: "normal" | "elevated" | "high") => {
    switch (type) {
    case "normal":
        return "border-l-green-500";
    case "elevated":
        return "border-l-yellow-500";
    case "high":
        return "border-l-red-500";
    }
};

export function AlertsPanel({ locations }: AlertViewProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                    Active Alerts
                </h3>
            </div>
            <div className="p-6 pb-20 max-h-full overflow-y-auto">
                <div className="space-y-4">
                    {locations.map((alert, index) => (
                        <div
                            key={index}
                            className={`p-4 border-l-4 bg-gray-50 rounded-r-lg hover:bg-gray-100 transition-colors ${getAlertBorderColor(
                                alert.alertLevel as "normal" | "elevated" | "high"
                            )}`}
                        >
                            <div className="flex items-start space-x-3">
                                {getAlertIcon(alert.alertLevel as "normal" | "elevated" | "high")}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-medium text-gray-900 truncate">
                                            {alert.facilityName}
                                        </h4>
                                        {getAlertBadge(alert.alertLevel as "normal" | "elevated" | "high")}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">
                                        {alert.facilityType}
                                    </p>
                                    <p className="text-xs text-gray-500 mb-2">
                                        {alert.alertLevel}
                                    </p>
                                    <div className="flex items-center text-xs text-gray-400">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {alert.lastMaintenance}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
