#!/usr/bin/env node

const fs = require('node:fs/promises');
const https = require('node:https');
const path = require('node:path');

const DRIVERS_URL = 'https://www.formula1.com/en/results/2026/drivers';
const TEAMS_URL = 'https://www.formula1.com/en/results/2026/team';
const OUTPUT_PATH = path.resolve(__dirname, '..', 'standings.live.json');

const TEAM_NAME_MAP = {
    'Mercedes': { name: 'Mercedes', color: '#00D2BE' },
    'Ferrari': { name: 'Ferrari', color: '#DC0000' },
    'McLaren': { name: 'McLaren', color: '#FF8700' },
    'Red Bull Racing': { name: 'Red Bull', color: '#3671C6' },
    'Alpine': { name: 'Alpine', color: '#2293D1' },
    'Haas F1 Team': { name: 'Haas', color: '#B6BABD' },
    'Racing Bulls': { name: 'Racing Bulls', color: '#2B6E9F' },
    'Williams': { name: 'Williams', color: '#005AFF' },
    'Audi': { name: 'Audi', color: '#1A1C2B' },
    'Cadillac': { name: 'Cadillac', color: '#C1C6D1' },
    'Aston Martin': { name: 'Aston Martin', color: '#229971' }
};

const DRIVER_NAME_MAP = {
    'Kimi Antonelli': 'Kimi Antonelli',
    'George Russell': 'George Russell',
    'Charles Leclerc': 'Charles Leclerc',
    'Lando Norris': 'Lando Norris',
    'Lewis Hamilton': 'Lewis Hamilton',
    'Oscar Piastri': 'Oscar Piastri',
    'Max Verstappen': 'Max Verstappen',
    'Oliver Bearman': 'Oliver Bearman',
    'Pierre Gasly': 'Pierre Gasly',
    'Liam Lawson': 'Liam Lawson',
    'Franco Colapinto': 'Franco Colapinto',
    'Arvid Lindblad': 'Arvid Lindblad',
    'Isack Hadjar': 'Isack Hadjar',
    'Carlos Sainz': 'Carlos Sainz',
    'Gabriel Bortoleto': 'Gabriel Bortoleto',
    'Esteban Ocon': 'Esteban Ocon',
    'Alexander Albon': 'Alexander Albon',
    'Nico Hulkenberg': 'Nico Hulkenberg',
    'Valtteri Bottas': 'Valtteri Bottas',
    'Sergio Perez': 'Sergio Perez',
    'Fernando Alonso': 'Fernando Alonso',
    'Lance Stroll': 'Lance Stroll'
};

function decodeHtmlEntities(input) {
    return String(input || '')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ');
}

function htmlToTokens(html) {
    return decodeHtmlEntities(
        String(html || '')
            .replace(/<script[\s\S]*?<\/script>/gi, ' ')
            .replace(/<style[\s\S]*?<\/style>/gi, ' ')
            .replace(/<(br|\/p|\/div|\/section|\/article|\/header|\/footer|\/li|\/tr|\/td|\/th|\/h1|\/h2|\/h3|\/h4|\/a)>/gi, '\n')
            .replace(/<[^>]+>/g, ' ')
    )
        .split(/\n+/)
        .map(token => token.replace(/\s+/g, ' ').trim())
        .filter(Boolean);
}

function stripDriverAbbreviation(nameToken) {
    return nameToken.replace(/\s+[A-Z]{3}$/, '').trim();
}

function findSection(tokens, headingText) {
    const start = tokens.findIndex(token => token.includes(headingText));
    if (start === -1) {
        throw new Error(`Could not find section "${headingText}"`);
    }
    const end = tokens.findIndex((token, index) => index > start && token.includes('OUR PARTNERS'));
    return tokens.slice(start, end === -1 ? undefined : end);
}

function parseTeams(tokens) {
    const section = findSection(tokens, "2026 Teams' Standings");
    const entries = [];
    for (let index = 0; index < section.length; index += 1) {
        if (!/^\d+$/.test(section[index])) continue;
        const teamLabel = section[index + 1];
        const points = section[index + 2];
        if (!teamLabel || !/^\d+$/.test(points)) continue;
        const mappedTeam = TEAM_NAME_MAP[teamLabel];
        if (!mappedTeam) {
            throw new Error(`Unmapped team label: ${teamLabel}`);
        }
        entries.push({
            name: mappedTeam.name,
            color: mappedTeam.color,
            points: Number(points)
        });
    }
    if (!entries.length) {
        throw new Error('No team standings parsed from official page');
    }
    return entries;
}

function parseDrivers(tokens) {
    const section = findSection(tokens, "2026 Drivers' Standings");
    const entries = [];
    for (let index = 0; index < section.length; index += 1) {
        if (!/^\d+$/.test(section[index])) continue;
        const rawName = section[index + 1];
        const nationality = section[index + 2];
        const teamLabel = section[index + 3];
        const points = section[index + 4];
        if (!rawName || !nationality || !teamLabel || !/^\d+$/.test(points)) continue;
        const cleanName = stripDriverAbbreviation(rawName);
        const mappedName = DRIVER_NAME_MAP[cleanName];
        const mappedTeam = TEAM_NAME_MAP[teamLabel];
        if (!mappedName) {
            throw new Error(`Unmapped driver label: ${cleanName}`);
        }
        if (!mappedTeam) {
            throw new Error(`Unmapped team label for driver ${cleanName}: ${teamLabel}`);
        }
        entries.push({
            name: mappedName,
            team: mappedTeam.name,
            points: Number(points)
        });
    }
    if (!entries.length) {
        throw new Error('No driver standings parsed from official page');
    }
    return entries;
}

async function fetchPage(url) {
    return new Promise((resolve, reject) => {
        const request = https.get(url, {
            headers: {
                'user-agent': 'f1-paddock-club standings sync'
            }
        }, response => {
            let body = '';
            response.setEncoding('utf8');
            response.on('data', chunk => {
                body += chunk;
            });
            response.on('end', () => {
                if (response.statusCode && response.statusCode >= 200 && response.statusCode < 300) {
                    resolve(body);
                    return;
                }
                reject(new Error(`Request failed for ${url}: HTTP ${response.statusCode}`));
            });
        });
        request.on('error', reject);
        request.end();
    });
}

async function main() {
    const [driversHtml, teamsHtml] = await Promise.all([
        fetchPage(DRIVERS_URL),
        fetchPage(TEAMS_URL)
    ]);

    const driverStandings = parseDrivers(htmlToTokens(driversHtml));
    const teamStandings = parseTeams(htmlToTokens(teamsHtml));

    const payload = {
        meta: {
            source: 'formula1.com',
            season: 2026,
            raceLabel: 'Latest official standings',
            updatedAt: new Date().toISOString()
        },
        teamStandings,
        driverStandings
    };

    await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

    console.log(`Wrote ${OUTPUT_PATH}`);
    console.log(`Top team: ${teamStandings[0].name} (${teamStandings[0].points})`);
    console.log(`Top driver: ${driverStandings[0].name} (${driverStandings[0].points})`);
}

main().catch(error => {
    console.error(error.message || error);
    process.exitCode = 1;
});
