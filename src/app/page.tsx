"use server";

import { getAllLocations } from "../../lib/dynamodb-setup";
import ViewContainer from "./view.container";
import { Location } from "./types";

export default async function Home() {
    const locations = await getAllLocations();
    return <ViewContainer locations={locations as Location[]} />;
}
