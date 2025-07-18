import { getLocationsByState } from "../../../../../../lib/dynamodb-setup";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get("state");

    try {
        if (!state) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "State parameter is required",
                }),
                { status: 400 }
            );
        }

        const locations = await getLocationsByState(state);
        return new Response(JSON.stringify(locations), { status: 200 });
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
