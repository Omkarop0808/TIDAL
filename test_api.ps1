$endpoints = @(
    @{ Name="Telemetry Summary"; Url="http://localhost:8000/api/v1/telemetry/summary"; Method="Get" },
    @{ Name="Hotspots Spatial"; Url="http://localhost:8000/api/v1/hotspots/spatial"; Method="Get" },
    @{ Name="Recovery Materials"; Url="http://localhost:8000/api/v1/recovery/materials"; Method="Get" },
    @{ Name="Simulate Predictive"; Url="http://localhost:8000/api/v1/simulate/predictive?lat=19.103&lon=72.825"; Method="Get" }
)

$postEndpoints = @(
    @{ Name="Simulate Scenario"; Url="http://localhost:8000/api/v1/simulate/scenario"; Body='{"wind_speed": 20, "rainfall_increase": 15, "barrier_efficiency": 80, "cleanup_teams": 5}' },
    @{ Name="OceanGPT Chat"; Url="http://localhost:8000/api/v1/chat"; Body='{"message": "What is the Juhu status?"}' },
    @{ Name="Dispatch Optimizer"; Url="http://localhost:8000/api/v1/dispatch/optimize"; Body='{"hotspots": ["Juhu"]}' }
)

$allPassed = $true

Write-Host "Starting E2E API Tests..."
Write-Host "=============================="

foreach ($ep in $endpoints) {
    try {
        $response = Invoke-RestMethod -Uri $ep.Url -Method Get -ErrorAction Stop
        Write-Host "[PASS] $($ep.Name)" -ForegroundColor Green
    } catch {
        Write-Host "[FAIL] $($ep.Name) - $($_.Exception.Message)" -ForegroundColor Red
        $allPassed = $false
    }
}

foreach ($ep in $postEndpoints) {
    try {
        $response = Invoke-RestMethod -Uri $ep.Url -Method Post -Body $ep.Body -ContentType "application/json" -ErrorAction Stop
        Write-Host "[PASS] $($ep.Name)" -ForegroundColor Green
    } catch {
        Write-Host "[FAIL] $($ep.Name) - $($_.Exception.Message)" -ForegroundColor Red
        $allPassed = $false
    }
}

Write-Host "=============================="
if ($allPassed) {
    Write-Host "ALL FEATURES VERIFIED: OK" -ForegroundColor Green
} else {
    Write-Host "SOME FEATURES FAILED!" -ForegroundColor Red
}
