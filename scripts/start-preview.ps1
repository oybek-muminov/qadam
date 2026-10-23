$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$previewUrl = 'http://127.0.0.1:1435/'
$nodePath = (Get-Command node.exe -ErrorAction Stop).Source
$vitePath = Join-Path $projectRoot 'node_modules\vite\bin\vite.js'
$indexPath = Join-Path $projectRoot 'dist\index.html'

if (-not (Test-Path -LiteralPath $indexPath)) {
    throw 'Production output is missing. Run npm.cmd run build first.'
}
if (-not (Test-Path -LiteralPath $vitePath)) {
    throw 'Vite is missing. Run npm.cmd ci first.'
}

# Never stop or replace an existing listener, including another project's service.
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 1435)
try {
    $listener.Start()
} catch {
    throw "Port 1435 is occupied. No process was changed. Check $previewUrl"
} finally {
    $listener.Stop()
}

$stdoutPath = Join-Path $projectRoot '.preview.stdout.log'
$stderrPath = Join-Path $projectRoot '.preview.stderr.log'
$previewProcess = Start-Process -FilePath $nodePath `
    -ArgumentList @("`"$vitePath`"", 'preview', '--host', '127.0.0.1', '--port', '1435', '--strictPort') `
    -WorkingDirectory $projectRoot -WindowStyle Hidden `
    -RedirectStandardOutput $stdoutPath -RedirectStandardError $stderrPath -PassThru

@{
    pid = $previewProcess.Id
    url = $previewUrl
    startedAt = (Get-Date).ToUniversalTime().ToString('o')
    stdout = $stdoutPath
    stderr = $stderrPath
} | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $projectRoot '.preview.json') -Encoding utf8

# This script exits after launching a detached Windows process.
Write-Output "Preview process $($previewProcess.Id) started at $previewUrl"
Write-Output "Logs: $stdoutPath and $stderrPath"
