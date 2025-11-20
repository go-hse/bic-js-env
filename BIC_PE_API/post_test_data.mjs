/**
Copyright 2025, Andreas Rößler, Hochschule Esslingen
Zur freien Verfügung für deutsche Hochschulen.
 
Script zur Erzeugung von Fake-Daten für BIC PE

1. Voraussetzungen:
- Installation von nodejs.org
- Dann 
    npm init
    npm install @faker-js/faker --save-dev

2. Anpassungen:
- tenantId aus Process Design URL
- processId aus Process Execution URL
- API-Key aus Admin-Oberfläche
- baseURL je nach Hochschule
- stageId: 
    dev=studio
    test=vorschau
    prod=prod

Faker: Generate massive amounts of fake (but realistic) data for testing and development.
https://fakerjs.dev/api/

 */


import { fakerDE as faker } from '@faker-js/faker';

const stageId = "dev";
const tenantId = "hier aendern";
const processId = "hier aendern";
const API_Key = "hier aendern";
const baseURL = "processapplibrary-hochschulen.processdesign.bicplatform.de";

const url = `https://${baseURL}/public/process-execution/api/tenants/${tenantId}/stages/${stageId}/processes/${processId}/instances`;

// Fake Daten
const sex = faker.person.sexType();
const firstName = faker.person.firstName(sex);
const lastName = faker.person.lastName();

const randomEmail = faker.internet.email({ firstName, lastName });
const randomName = `${firstName} ${lastName}`;
const userName = `${firstName}.${lastName}`.toLowerCase();

// Fälligkeitsdatum in 2 Tagen
const now = new Date();
const timeString = now.toLocaleTimeString();
const twoDays = new Date(now)
twoDays.setDate(now.getDate() + 2);

// Funktion zum Senden
async function send(body) {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { accept: "*/*", "Content-Type": "application/json", "X-Api-Key": API_Key, },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            console.error("Fehler:", response.status, response.statusText);
            return;
        }
        const ended = new Date();
        console.log("Erfolg nach", ended - now, "ms");
    } catch (error) {
        console.error("Netzwerk-/Laufzeitfehler:", error);
    }
}

// Start-Funktion, Aufruf der Send-Funktion
(async () => {
    const variables = {
        "_case.name": `JavaScript Schulung, ${timeString}`,
        "_case.dueDate": new Date(twoDays).toISOString(),
        randomEmail, randomName, userName
    };
    const body = { variables };
    await send(body);
})();

