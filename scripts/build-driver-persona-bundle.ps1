$ErrorActionPreference = 'Stop'

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$sourceDir = Join-Path $repoRoot 'data\drivers'
$outputFile = Join-Path $sourceDir 'persona-bundle.js'

if (-not (Test-Path $sourceDir)) {
    throw "Driver persona source directory not found: $sourceDir"
}

$files = Get-ChildItem -Path $sourceDir -Filter '*.json' | Sort-Object Name
if (-not $files.Count) {
    throw "No driver persona JSON files found in: $sourceDir"
}

$personas = foreach ($file in $files) {
    $raw = Get-Content -Path $file.FullName -Encoding UTF8 -Raw
    $parsed = $raw | ConvertFrom-Json
    if (-not $parsed.identity.id) {
        throw "Persona file missing identity.id: $($file.Name)"
    }
    $parsed
}

$manifest = @($personas | ForEach-Object { $_.identity.id })
$generatedAt = (Get-Date).ToString('s')
$manifestJson = $manifest | ConvertTo-Json -Depth 10 -Compress
$personasJson = $personas | ConvertTo-Json -Depth 100

$bundle = @"
(function () {
  window.DRIVER_PERSONA_BUNDLE_VERSION = '$generatedAt';
  window.DRIVER_PERSONA_MANIFEST = $manifestJson;
  window.DRIVER_PERSONA_EMBEDDED = $personasJson;
})();
"@

Set-Content -Path $outputFile -Value $bundle -Encoding UTF8
Write-Output "Built driver persona bundle: $outputFile"
