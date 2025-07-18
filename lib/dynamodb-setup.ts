// lib/dynamodb-setup.js
// This runs on the server side only
import {
    DynamoDBClient,
    type CreateTableCommandInput,
} from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    ScanCommand,
    QueryCommand,
    BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import {
    CreateTableCommand,
    DescribeTableCommand,
    waitUntilTableExists,
} from "@aws-sdk/client-dynamodb";

// Configure AWS client
const dynamoClient = new DynamoDBClient({
    region: process.env.AWS_REGION || ("us-east-1" as string),
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
});

const docClient = DynamoDBDocumentClient.from(dynamoClient);

// Table configuration
const TABLE_NAME = "GasMonitoringLocations";

const tableConfig = {
    TableName: TABLE_NAME,
    KeySchema: [
        { AttributeName: "locationId", KeyType: "HASH" },
        { AttributeName: "timestamp", KeyType: "RANGE" },
    ],
    AttributeDefinitions: [
        { AttributeName: "locationId", AttributeType: "S" },
        { AttributeName: "timestamp", AttributeType: "N" },
        { AttributeName: "state", AttributeType: "S" },
        { AttributeName: "gasType", AttributeType: "S" },
    ],
    GlobalSecondaryIndexes: [
        {
            IndexName: "StateGasTypeIndex",
            KeySchema: [
                { AttributeName: "state", KeyType: "HASH" },
                { AttributeName: "gasType", KeyType: "RANGE" },
            ],
            Projection: { ProjectionType: "ALL" },
            BillingMode: "PAY_PER_REQUEST",
        },
    ],
    BillingMode: "PAY_PER_REQUEST",
};

// Sample data for seeding
const sampleData = [
    {
        locationId: "TX-REFINERY-001",
        timestamp: Date.now(),
        facilityName: "Houston Refinery Complex",
        address: "1200 Industrial Blvd, Houston, TX 77015",
        latitude: 29.7372,
        longitude: -95.2618,
        state: "TX",
        country: "USA",
        facilityType: "Oil Refinery",
        gasType: "CH4",
        currentReading: 245.7,
        unit: "ppm",
        alertLevel: "normal",
        lastMaintenance: "2024-06-15",
        operatorCompany: "PetroTech Industries",
        monitoringEquipment: "Spectral Sensor v3.2",
        notes: "Regular monitoring of storage tanks and processing units",
    },
    {
        locationId: "AB-OILSANDS-002",
        timestamp: Date.now(),
        facilityName: "Alberta Oil Sands Facility",
        address: "Highway 63, Fort McMurray, AB T9H 3L1",
        latitude: 56.7267,
        longitude: -111.379,
        state: "AB",
        country: "CAN",
        facilityType: "Oil Sands",
        gasType: "CO2",
        currentReading: 412.5,
        unit: "ppm",
        alertLevel: "elevated",
        lastMaintenance: "2024-05-20",
        operatorCompany: "Northern Energy Corp",
        monitoringEquipment: "FTIR Analyzer Pro",
        notes: "Monitoring extraction and processing operations",
    },
    {
        locationId: "CA-LANDFILL-003",
        timestamp: Date.now(),
        facilityName: "Los Angeles County Landfill",
        address: "14275 Pearblossom Hwy, Littlerock, CA 93543",
        latitude: 34.5208,
        longitude: -117.9892,
        state: "CA",
        country: "USA",
        facilityType: "Landfill",
        gasType: "CH4",
        currentReading: 1850.3,
        unit: "ppm",
        alertLevel: "high",
        lastMaintenance: "2024-07-01",
        operatorCompany: "Waste Management Solutions",
        monitoringEquipment: "Laser Methane Detector",
        notes: "High methane emissions from organic waste decomposition",
    },
    {
        locationId: "ND-FRACKING-004",
        timestamp: Date.now(),
        facilityName: "Bakken Shale Gas Site",
        address: "County Road 15, Williston, ND 58801",
        latitude: 48.147,
        longitude: -103.618,
        state: "ND",
        country: "USA",
        facilityType: "Fracking Site",
        gasType: "CH4",
        currentReading: 3.2,
        unit: "ppm",
        alertLevel: "normal",
        lastMaintenance: "2024-06-28",
        operatorCompany: "Shale Energy Partners",
        monitoringEquipment: "Portable Gas Chromatograph",
        notes: "Monitoring wellhead and flare stack emissions",
    },
    {
        locationId: "ON-CHEMICAL-005",
        timestamp: Date.now(),
        facilityName: "Sarnia Chemical Complex",
        address: "800 Vidal St S, Sarnia, ON N7T 3A1",
        latitude: 42.9849,
        longitude: -82.4065,
        state: "ON",
        country: "CAN",
        facilityType: "Chemical Plant",
        gasType: "N2O",
        currentReading: 0.85,
        unit: "ppm",
        alertLevel: "normal",
        lastMaintenance: "2024-06-10",
        operatorCompany: "ChemCorp Industries",
        monitoringEquipment: "Multi-Gas Analyzer",
        notes: "Monitoring nitrous oxide from chemical processes",
    },
    {
        locationId: "WV-COAL-006",
        timestamp: Date.now(),
        facilityName: "Appalachian Coal Power Plant",
        address: "500 Power Plant Rd, Huntington, WV 25705",
        latitude: 38.4192,
        longitude: -82.4452,
        state: "WV",
        country: "USA",
        facilityType: "Coal Power Plant",
        gasType: "CO2",
        currentReading: 890.2,
        unit: "ppm",
        alertLevel: "elevated",
        lastMaintenance: "2024-05-15",
        operatorCompany: "Mountain State Power",
        monitoringEquipment: "Stack Gas Analyzer",
        notes: "Continuous monitoring of coal combustion emissions",
    },
    {
        locationId: "AK-OILFIELD-007",
        timestamp: Date.now(),
        facilityName: "Prudhoe Bay Oil Field",
        address: "Dalton Highway, Deadhorse, AK 99734",
        latitude: 70.2553,
        longitude: -148.4597,
        state: "AK",
        country: "USA",
        facilityType: "Oil Field",
        gasType: "CH4",
        currentReading: 12.8,
        unit: "ppm",
        alertLevel: "normal",
        lastMaintenance: "2024-06-22",
        operatorCompany: "Arctic Oil Corp",
        monitoringEquipment: "Cryogenic Gas Sampler",
        notes: "Remote monitoring in extreme arctic conditions",
    },
    {
        locationId: "QC-SMELTER-008",
        timestamp: Date.now(),
        facilityName: "Aluminum Smelter Plant",
        address: "1500 Rue de l'Aluminium, Saguenay, QC G7S 4R5",
        latitude: 48.3477,
        longitude: -71.034,
        state: "QC",
        country: "CAN",
        facilityType: "Smelter",
        gasType: "CO2",
        currentReading: 445.8,
        unit: "ppm",
        alertLevel: "normal",
        lastMaintenance: "2024-07-05",
        operatorCompany: "Aluminum North America",
        monitoringEquipment: "Infrared Gas Analyzer",
        notes: "Monitoring carbon emissions from aluminum production",
    },
    {
        locationId: "NM-NATGAS-009",
        timestamp: Date.now(),
        facilityName: "Permian Basin Gas Processing",
        address: "2200 County Road 140, Carlsbad, NM 88220",
        latitude: 32.4207,
        longitude: -104.2288,
        state: "NM",
        country: "USA",
        facilityType: "Natural Gas Processing",
        gasType: "CH4",
        currentReading: 156.4,
        unit: "ppm",
        alertLevel: "elevated",
        lastMaintenance: "2024-06-18",
        operatorCompany: "Southwest Gas Solutions",
        monitoringEquipment: "Tunable Diode Laser",
        notes: "Processing facility with multiple wellhead connections",
    },
    {
        locationId: "MB-AGRICULTURE-010",
        timestamp: Date.now(),
        facilityName: "Manitoba Livestock Operation",
        address: "15 Rural Route 2, Brandon, MB R7A 5Y3",
        latitude: 49.8397,
        longitude: -99.9531,
        state: "MB",
        country: "CAN",
        facilityType: "Agriculture",
        gasType: "CH4",
        currentReading: 2.1,
        unit: "ppm",
        alertLevel: "normal",
        lastMaintenance: "2024-06-25",
        operatorCompany: "Prairie Farms Ltd",
        monitoringEquipment: "Cavity Ring-Down Spectroscopy",
        notes: "Monitoring methane emissions from livestock operations",
    },
];

// Create table function
export async function createTable() {
    try {
        const command = new CreateTableCommand(
            tableConfig as CreateTableCommandInput
        );
        await dynamoClient.send(command);

        // Wait for table to be created
        await waitUntilTableExists(
            { client: dynamoClient, maxWaitTime: 300 },
            { TableName: TABLE_NAME }
        );

        console.log("Table created successfully");
        return { success: true, message: "Table created successfully" };
    } catch (error) {
        if (error instanceof Error && error.name === "ResourceInUseException") {
            return { success: true, message: "Table already exists" };
        }
        console.error("Error creating table:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

// Check if table exists
export async function checkTableExists() {
    try {
        const command = new DescribeTableCommand({ TableName: TABLE_NAME });
        await dynamoClient.send(command);
        return true;
    } catch (error) {
        console.error("Error checking table exists:", error);
        return false;
    }
}

// Seed data function
export async function seedData() {
    try {
        // Check if table exists first
        const tableExists = await checkTableExists();
        if (!tableExists) {
            throw new Error("Table does not exist. Create table first.");
        }

        // Insert data in batches (DynamoDB batch limit is 25 items)
        const batchSize = 25;
        const batches = [];

        for (let i = 0; i < sampleData.length; i += batchSize) {
            const batch = sampleData.slice(i, i + batchSize);
            batches.push(batch);
        }

        for (const batch of batches) {
            const command = new BatchWriteCommand({
                RequestItems: {
                    [TABLE_NAME]: batch.map((item) => ({
                        PutRequest: {
                            Item: item,
                        },
                    })),
                },
            });

            await docClient.send(command);
        }

        console.log("Data seeded successfully");
        return { success: true, message: "Data seeded successfully" };
    } catch (error) {
        console.error("Error seeding data:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

// Get all monitoring locations
export async function getAllLocations() {
    try {
        const command = new ScanCommand({
            TableName: TABLE_NAME,
        });

        const result = await docClient.send(command);
        return result.Items;
    } catch (error) {
        console.error("Error fetching locations:", error);
        throw error;
    }
}

// Get locations by state
export async function getLocationsByState(state: string) {
    try {
        const command = new QueryCommand({
            TableName: TABLE_NAME,
            IndexName: "StateGasTypeIndex",
            KeyConditionExpression: "#state = :state",
            ExpressionAttributeNames: {
                "#state": "state",
            },
            ExpressionAttributeValues: {
                ":state": state,
            },
        });

        const result = await docClient.send(command);
        return result.Items;
    } catch (error) {
        console.error("Error fetching locations by state:", error);
        throw error;
    }
}

// Convert to GeoJSON format for Mapbox
export function convertToGeoJSON(locations: any[]) { // eslint-disable-line @typescript-eslint/no-explicit-any
    return {
        type: "FeatureCollection",
        features: locations.map((location) => ({
            type: "Feature",
            properties: {
                locationId: location.locationId,
                facilityName: location.facilityName,
                address: location.address,
                facilityType: location.facilityType,
                gasType: location.gasType,
                currentReading: location.currentReading,
                unit: location.unit,
                alertLevel: location.alertLevel,
                operatorCompany: location.operatorCompany,
                lastMaintenance: location.lastMaintenance,
                notes: location.notes,
                color: getAlertColor(location.alertLevel),
                icon: getFacilityIcon(location.facilityType),
            },
            geometry: {
                type: "Point",
                coordinates: [location.longitude, location.latitude],
            },
        })),
    };
}

// Helper functions
function getAlertColor(alertLevel: string) {
    const colors = {
        normal: "#28a745",
        elevated: "#ffc107",
        high: "#dc3545",
    };
    return colors[alertLevel as keyof typeof colors] || "#6c757d";
}

function getFacilityIcon(facilityType: string) {
    const icons = {
        "Oil Refinery": "oil-well",
        "Oil Sands": "oil-well",
        Landfill: "trash",
        "Fracking Site": "oil-well",
        "Chemical Plant": "industry",
        "Coal Power Plant": "industry",
        "Oil Field": "oil-well",
        Smelter: "industry",
        "Natural Gas Processing": "oil-well",
        Agriculture: "leaf",
    };
    return icons[facilityType as keyof typeof icons] || "circle";
}
