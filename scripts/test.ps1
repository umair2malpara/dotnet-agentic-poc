$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$repositoryRoot = Split-Path -Parent $PSScriptRoot
$solutionPath = Join-Path $repositoryRoot 'dotnet-agentic-poc.slnx'
$frontendPath = Join-Path $repositoryRoot 'src\frontend'

Get-Command dotnet -ErrorAction Stop | Out-Null
Get-Command npm.cmd -ErrorAction Stop | Out-Null

Write-Output 'Testing backend...'
& dotnet test $solutionPath
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Output 'Installing frontend dependencies...'
& npm.cmd ci --prefix $frontendPath
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Output 'Testing frontend...'
& npm.cmd test --prefix $frontendPath -- --watch=false
exit $LASTEXITCODE
