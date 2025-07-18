"use client";

import Map, { FullscreenControl, Marker, Popup, ViewState } from "react-map-gl/mapbox";
import { Earth, Factory, MapPinHouse } from "lucide-react";
import { useState, useCallback, useRef } from "react";
import type { MapBoxProps } from "./types";
import "mapbox-gl/dist/mapbox-gl.css";

export default function MapBox({ locations, selectedLocation, setSelectedLocation, viewState, setViewState }: MapBoxProps) {
    const [showPopup, setShowPopup] = useState<boolean>(false);

    const isMovingRef = useRef(false);
    
    const onMove = useCallback((evt: { viewState: ViewState }) => {
        if (!isMovingRef.current) {
            isMovingRef.current = true;
            setViewState({ ...evt.viewState, width: 800, height: 600 });
            setTimeout(() => {
                isMovingRef.current = false;
            }, 50);
        }
    }, []);

    return (
        <div className="h-96 w-full bg-gray-100 rounded-lg relative overflow-hidden border border-gray-200">
            <Map
                reuseMaps={false}
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                viewState={viewState}
                onMove={onMove}
                style={{ width: "100%", height: "100%" }}
                mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
            >
                {locations.map((location) => (
                    <Marker
                        className="cursor-pointer"
                        longitude={selectedLocation ? selectedLocation.longitude : location.longitude}
                        latitude={selectedLocation ? selectedLocation.latitude : location.latitude}
                        key={location.locationId}
                        anchor="bottom"
                        onClick={(e) => {
                            e.originalEvent.stopPropagation();
                            setSelectedLocation(selectedLocation ? selectedLocation : location);
                            setShowPopup(true);
                            setViewState({
                                ...viewState,
                                longitude: selectedLocation ? selectedLocation.longitude : location.longitude,
                                latitude: selectedLocation ? selectedLocation.latitude : location.latitude,
                                zoom: 4,
                            });
                        }}
                    />
                ))}
                {selectedLocation && showPopup && (
                    <Popup
                        className="bg-white text-black rounded-lg"
                        longitude={selectedLocation.longitude}
                        latitude={selectedLocation.latitude}
                        anchor="top-left"
                        onClose={() => {
                            setShowPopup(false);
                            setSelectedLocation(null);
                            setViewState({
                                ...viewState,
                                zoom: 2,
                            });
                        }}
                    >
                        <div className="text-black flex gap-2"><Earth className="w-4 h-4" />{selectedLocation.state}, {selectedLocation.country}</div>
                        <div className="text-black flex gap-2"><MapPinHouse className="w-4 h-4" />{selectedLocation.address}</div>
                        <div className="text-black flex gap-2"><Factory className="w-4 h-4" />{selectedLocation.facilityName}</div>
                    </Popup>
                )}
                <FullscreenControl />
            </Map>
        </div>
    );
}
