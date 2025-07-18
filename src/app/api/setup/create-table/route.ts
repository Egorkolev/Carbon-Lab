import { createTable } from "../../../../../lib/dynamodb-setup";

export async function POST() {
    try {
        const result = await createTable();
        if (result.success) {
            return new Response(JSON.stringify(result), { status: 200 });
        } else {
            return new Response(JSON.stringify(result), { status: 500 });
        }
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
