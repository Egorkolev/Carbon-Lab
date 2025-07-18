import {
    createTable,
    seedData,
    checkTableExists,
} from "../../../../../lib/dynamodb-setup";

export async function POST() {
    try {
        const steps = [];

        // Step 1: Check if table exists
        const tableExists = await checkTableExists();
        if (!tableExists) {
            // Step 2: Create table
            const createResult = await createTable();
            steps.push({ step: "create-table", result: createResult });

            if (!createResult.success) {
                return new Response(JSON.stringify({ success: false, steps }), {
                    status: 500,
                });
            }
        } else {
            steps.push({
                step: "create-table",
                result: { success: true, message: "Table already exists" },
            });
        }

        // Step 3: Seed data
        const seedResult = await seedData();
        steps.push({ step: "seed-data", result: seedResult });

        const allSuccess = steps.every((step) => step.result.success);

        return new Response(
            JSON.stringify({
                success: allSuccess,
                message: allSuccess
                    ? "Setup completed successfully"
                    : "Setup completed with errors",
                steps,
            }),
            { status: allSuccess ? 200 : 500 }
        );
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
