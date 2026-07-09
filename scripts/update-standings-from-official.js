#!/usr/bin/env node

const fs = require('node:fs/promises');
const https = require('node:https');
const path = require('node:path');

const DRIVERS_URL = 'https://www.formula1.com/en/results/2026/drivers';
const TEAMS_URL = 'https://www.formula1.com/en/results/2026/team';
const RACES_URL = 'https://www.formula1.com/en/results/2026/races';
const OUTPUT_PATH = path.resolve(__dirname, '..', 'standings.live.json');
const BUNDLE_OUTPUT_PATH = path.resolve(__dirname, '..', 'standings.live.bundle.js');

const LOCAL_RACE_MAP = {
    australia: { round: 1, label: 'Australian Grand Prix' },
    china: { round: 2, label: 'Chinese Grand Prix' },
    japan: { round: 3, label: 'Japanese Grand Prix' },
    miami: { round: 6, label: 'Miami Grand Prix' },
    canada: { round: 7, label: 'Canadian Grand Prix' },
    monaco: { round: 8, label: 'Monaco Grand Prix' },
    barcelona: { round: 9, label: 'Barcelona-Catalunya Grand Prix' },
    spain: { round: 9, label: 'Barcelona-Catalunya Grand Prix' },
    austria: { round: 10, label: 'Austrian Grand Prix' },
    'great-britain': { round: 11, label: 'British Grand Prix' },
    'united-kingdom': { round: 11, label: 'British Grand Prix' },
    belgium: { round: 12, label: 'Belgian Grand Prix' },
    hungary: { round: 13, label: 'Hungarian Grand Prix' },
    netherlands: { round: 14, label: 'Dutch Grand Prix' },
    italy: { round: 15, label: 'Italian Grand Prix' },
    madrid: { round: 16, label: 'Madrid Grand Prix' },
    'spain-2': { round: 16, label: 'Spanish Grand Prix' },
    azerbaijan: { round: 17, label: 'Azerbaijan Grand Prix' },
    singapore: { round: 18, label: 'Singapore Grand Prix' },
    'united-states': { round: 19, label: 'United States Grand Prix' },
    mexico: { round: 20, label: 'Mexico City Grand Prix' },
    brazil: { round: 21, label: 'Sao Paulo Grand Prix' },
    'las-vegas': { round: 22, label: 'Las Vegas Grand Prix' },
    qatar: { round: 23, label: 'Qatar Grand Prix' },
    'abu-dhabi': { round: 24, label: 'Abu Dhabi Grand Prix' }
};

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

function extractRaceResultCandidates(html) {
    const candidates = new Map();
    const pattern = /href=["']([^"']*\/en\/results\/2026\/races\/(\d+)\/([^\/"']+)\/race-result)["']/gi;
    for (const match of String(html || '').matchAll(pattern)) {
        const id = Number(match[2]);
        const slug = String(match[3] || '').trim().toLowerCase();
        if (!id || !slug || !LOCAL_RACE_MAP[slug]) continue;
        candidates.set(`${id}-${slug}`, {
            id,
            slug,
            url: new URL(match[1], 'https://www.formula1.com').href
        });
    }
    return Array.from(candidates.values()).sort((left, right) => right.id - left.id);
}

function parseTopRaceFinishers(tokens) {
    const headingIndex = tokens.findIndex(token => token.includes('RACE RESULT'));
    if (headingIndex === -1) throw new Error('Race result heading not found');
    const section = tokens.slice(headingIndex);
    const finishers = [];
    for (let index = 0; index < section.length && finishers.length < 3; index += 1) {
        const position = Number(section[index]);
        const carNumber = section[index + 1];
        const rawName = section[index + 2];
        const teamLabel = section[index + 3];
        if (position !== finishers.length + 1 || !/^\d+$/.test(carNumber || '') || !rawName || !teamLabel) continue;
        const cleanName = stripDriverAbbreviation(rawName);
        const mappedName = DRIVER_NAME_MAP[cleanName];
        if (!mappedName) throw new Error(`Unmapped race-result driver label: ${cleanName}`);
        finishers.push(mappedName);
    }
    if (finishers.length < 3) throw new Error('Official race result is not complete yet');
    return finishers;
}

function parseSessionPointRows(tokens, headingText) {
    const headingIndex = tokens.findIndex(token => token.includes(headingText));
    if (headingIndex === -1) throw new Error(`${headingText} heading not found`);
    const section = tokens.slice(headingIndex);
    const rows = [];
    for (let index = 0; index < section.length; index += 1) {
        const position = Number(section[index]);
        const carNumber = section[index + 1];
        const rawName = section[index + 2];
        const teamLabel = section[index + 3];
        const points = section[index + 6];
        if (!Number.isInteger(position) || position < 1 || !/^\d+$/.test(carNumber || '') || !rawName || !teamLabel || !/^\d+$/.test(points || '')) continue;
        const cleanName = stripDriverAbbreviation(rawName);
        const mappedName = DRIVER_NAME_MAP[cleanName];
        const mappedTeam = TEAM_NAME_MAP[teamLabel];
        if (!mappedName) throw new Error(`Unmapped session driver label: ${cleanName}`);
        if (!mappedTeam) throw new Error(`Unmapped session team label: ${teamLabel}`);
        rows.push({
            pos: position,
            driver: mappedName,
            team: mappedTeam.name,
            points: Number(points)
        });
    }
    if (!rows.length) throw new Error(`${headingText} points could not be parsed`);
    return rows;
}

function parsePoleDriver(tokens) {
    const headingIndex = tokens.findIndex(token => token.endsWith('QUALIFYING') && !token.includes('SPRINT'));
    if (headingIndex === -1) throw new Error('Qualifying heading not found');
    const section = tokens.slice(headingIndex);
    for (let index = 0; index < section.length; index += 1) {
        if (section[index] !== '1' || !/^\d+$/.test(section[index + 1] || '')) continue;
        const cleanName = stripDriverAbbreviation(section[index + 2]);
        const mappedName = DRIVER_NAME_MAP[cleanName];
        if (!mappedName) throw new Error(`Unmapped qualifying driver label: ${cleanName}`);
        return mappedName;
    }
    throw new Error('Official qualifying result is not complete yet');
}

async function fetchLatestPredictionResult(racesHtml) {
    const candidates = extractRaceResultCandidates(racesHtml);
    for (const candidate of candidates) {
        try {
            const raceHtml = await fetchPage(candidate.url);
            const raceTokens = htmlToTokens(raceHtml);
            const finishers = parseTopRaceFinishers(raceTokens);
            const raceRows = parseSessionPointRows(raceTokens, 'RACE RESULT');
            const qualifyingUrl = candidate.url.replace(/\/race-result$/, '/qualifying');
            const qualifyingHtml = await fetchPage(qualifyingUrl);
            const pole = parsePoleDriver(htmlToTokens(qualifyingHtml));
            let sprintRows = [];
            try {
                const sprintUrl = candidate.url.replace(/\/race-result$/, '/sprint-results');
                const sprintHtml = await fetchPage(sprintUrl);
                sprintRows = parseSessionPointRows(htmlToTokens(sprintHtml), ' - SPRINT');
            } catch (error) {
                console.warn(`No completed sprint result for ${candidate.slug}: ${error.message || error}`);
            }
            const raceMeta = LOCAL_RACE_MAP[candidate.slug];
            return {
                raceLabel: raceMeta.label,
                latestRaceResult: {
                    round: raceMeta.round,
                    raceLabel: raceMeta.label,
                    qualifying: [{ pos: 1, driver: pole, team: '', time: '' }],
                    sprint: sprintRows,
                    race: raceRows
                },
                predictionResult: {
                    round: raceMeta.round,
                    pole,
                    winner: finishers[0],
                    podium: finishers.slice(1, 3)
                }
            };
        } catch (error) {
            console.warn(`Skipping race candidate ${candidate.slug}: ${error.message || error}`);
        }
    }
    throw new Error('No completed official race and qualifying result could be parsed');
}

function buildBrowserBundle(payload) {
    return `// Generated by scripts/update-standings-from-official.js\nwindow.STANDINGS_LIVE_PAYLOAD = ${JSON.stringify(payload, null, 4)};\n`;
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
    const [driversHtml, teamsHtml, racesHtml] = await Promise.all([
        fetchPage(DRIVERS_URL),
        fetchPage(TEAMS_URL),
        fetchPage(RACES_URL)
    ]);

    const driverStandings = parseDrivers(htmlToTokens(driversHtml));
    const teamStandings = parseTeams(htmlToTokens(teamsHtml));
    const latestRace = await fetchLatestPredictionResult(racesHtml);

    const payload = {
        meta: {
            source: 'formula1.com',
            season: 2026,
            raceLabel: latestRace.raceLabel,
            updatedAt: new Date().toISOString()
        },
        predictionResult: latestRace.predictionResult,
        latestRaceResult: latestRace.latestRaceResult,
        teamStandings,
        driverStandings
    };

    await Promise.all([
        fs.writeFile(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8'),
        fs.writeFile(BUNDLE_OUTPUT_PATH, buildBrowserBundle(payload), 'utf8')
    ]);

    console.log(`Wrote ${OUTPUT_PATH}`);
    console.log(`Wrote ${BUNDLE_OUTPUT_PATH}`);
    console.log(`Latest race: ${latestRace.raceLabel}`);
    console.log(`Top team: ${teamStandings[0].name} (${teamStandings[0].points})`);
    console.log(`Top driver: ${driverStandings[0].name} (${driverStandings[0].points})`);
}

main().catch(error => {
    console.error(error.message || error);
    process.exitCode = 1;
});
