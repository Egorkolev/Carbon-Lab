import {
    getAllLocations,
    convertToGeoJSON,
} from "../../../../lib/dynamodb-setup";

export async function GET() {
    try {
        const locations = await getAllLocations();
        const geojson = convertToGeoJSON(locations || []);
        return new Response(JSON.stringify(geojson), { status: 200 });
    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                message:
                    error instanceof Error ? error.message : "Unknown error",
            }),
            { status: 500 }
        );
    }
}
