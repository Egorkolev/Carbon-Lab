"use client";
import Head from "next/head";
import { useState } from "react";

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<any | null>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

    const runFullSetup = async () => {
        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const response = await fetch("/api/setup/full-setup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok) {
                setResults(data);
            } else {
                setError(data.message || "Setup failed");
            }
        } catch (err) {
            setError(
                "Network error: " +
                    (err instanceof Error ? err.message : "Unknown error")
            );
        } finally {
            setLoading(false);
        }
    };

    const testConnection = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/locations");
            const data = await response.json();

            if (response.ok) {
                setResults({
                    success: true,
                    message: `Successfully connected! Found ${data.features.length} monitoring locations.`,
                    data: data.features.slice(0, 3), // Show first 3 locations
                });
            } else {
                setError(data.message || "Connection test failed");
            }
        } catch (err) {
            setError(
                "Network error: " +
                    (err instanceof Error ? err.message : "Unknown error")
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <Head>
                    <title>DynamoDB Setup - Greenhouse Gas Monitoring</title>
                </Head>

                <div className="max-w-3xl mx-auto">
                    <div className="bg-white shadow-lg rounded-lg p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                DynamoDB Setup
                            </h1>
                            <p className="text-gray-600">
                                Initialize your greenhouse gas monitoring
                                database
                            </p>
                        </div>

                        {/* Environment Check */}
                        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                            <h3 className="text-lg font-medium text-yellow-800 mb-2">
                                Environment Variables Required:
                            </h3>
                            <ul className="text-sm text-yellow-700 space-y-1">
                                <li>• AWS_ACCESS_KEY_ID</li>
                                <li>• AWS_SECRET_ACCESS_KEY</li>
                                <li>• AWS_REGION</li>
                            </ul>
                            <p className="text-sm text-yellow-700 mt-2">
                                Make sure these are set in your .env.local file
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <button
                                onClick={runFullSetup}
                                disabled={loading}
                                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? "Setting up..." : "Run Full Setup"}
                            </button>

                            <button
                                onClick={testConnection}
                                disabled={loading}
                                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? "Testing..." : "Test Connection"}
                            </button>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-2 text-gray-600">
                                    Processing...
                                </p>
                            </div>
                        )}

                        {/* Error Display */}
                        {error && (
                            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md">
                                <h3 className="text-lg font-medium text-red-800 mb-2">
                                    Error:
                                </h3>
                                <p className="text-red-700">{error}</p>
                            </div>
                        )}

                        {/* Results Display */}
                        {results && (
                            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-md">
                                <h3 className="text-lg font-medium text-green-800 mb-2">
                                    {results.success
                                        ? "Success!"
                                        : "Completed with issues"}
                                </h3>
                                <p className="text-green-700 mb-4">
                                    {results.message}
                                </p>

                                {results.steps && (
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-green-800">
                                            Setup Steps:
                                        </h4>
                                        {results.steps.map(
                                            (
                                                step: any, index: number // eslint-disable-line @typescript-eslint/no-explicit-any
                                            ) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <span
                                                        className={`w-2 h-2 rounded-full ${
                                                            step.result.success
                                                                ? "bg-green-500"
                                                                : "bg-red-500"
                                                        }`}
                                                    ></span>
                                                    <span className="text-sm">
                                                        {step.step}:{" "}
                                                        {step.result.message}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}

                                {results.data && (
                                    <div className="mt-4">
                                        <h4 className="font-medium text-green-800 mb-2">
                                            Sample Data:
                                        </h4>
                                        <div className="bg-white p-3 rounded border text-sm">
                                            {results.data.map(
                                                (
                                                    location: any, index: number // eslint-disable-line @typescript-eslint/no-explicit-any
                                                ) => (
                                                    <div
                                                        key={index}
                                                        className="py-1"
                                                    >
                                                        <strong>
                                                            {
                                                                location
                                                                    .properties
                                                                    .facilityName
                                                            }
                                                        </strong>{" "}
                                                        -
                                                        {
                                                            location.properties
                                                                .gasType
                                                        }
                                                        :{" "}
                                                        {
                                                            location.properties
                                                                .currentReading
                                                        }{" "}
                                                        {
                                                            location.properties
                                                                .unit
                                                        }
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Instructions */}
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                            <h3 className="text-lg font-medium text-blue-800 mb-2">
                                Next Steps:
                            </h3>
                            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                                <li>
                                    Run the full setup to create your DynamoDB
                                    table and seed data
                                </li>
                                <li>
                                    Test the connection to verify everything is
                                    working
                                </li>
                                <li>
                                    Navigate to your main application to see the
                                    Mapbox integration
                                </li>
                                <li>
                                    Start building your greenhouse gas
                                    monitoring dashboard
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
