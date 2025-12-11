import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CITIES = [
    "Curitiba",
    "São José dos Pinhais",
    "Colombo",
    "Pinhais",
    "Araucária",
    "Fazenda Rio Grande"
];

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

async function fetchStreetsForCity(city) {
    console.log(`Fetching streets for: ${city}...`);
    const query = `
    [out:json];
    area["name"="${city}"]->.searchArea;
    (
      way["highway"]["name"](area.searchArea);
    );
    out body;
  `;

    try {
        const response = await axios.post(OVERPASS_URL, query, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        if (response.data && response.data.elements) {
            const streets = response.data.elements
                .map(el => el.tags.name)
                .filter(name => name); // Remove empty names
            return streets;
        }
        return [];
    } catch (error) {
        console.error(`Error fetching data for ${city}:`, error.message);
        return [];
    }
}

async function updateStreets() {
    console.log("Starting Street Bot...");
    let allStreets = [];

    for (const city of CITIES) {
        const streets = await fetchStreetsForCity(city);
        console.log(`Found ${streets.length} streets in ${city}.`);
        allStreets = [...allStreets, ...streets];
    }

    // Remove duplicates and sort
    const uniqueStreets = [...new Set(allStreets)].sort((a, b) => a.localeCompare(b));

    console.log(`Total unique streets found: ${uniqueStreets.length}`);

    const outputPath = path.join(__dirname, '../src/data/locais-curitiba.json');

    // Create directory if it doesn't exist (though src/data should exist)
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(uniqueStreets, null, 2));
    console.log(`Successfully updated ${outputPath}`);
}

updateStreets();
