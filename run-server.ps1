# SmartStock AI - Zero-Install Native PowerShell Web Server
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "    SmartStock AI - Intelligent Inventory & B2B Network" -ForegroundColor Green
Write-Host "    Hackathon Theme: Industry Innovation" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

$port = 3000
$prefix = "http://localhost:$port/"
$baseDir = $PSScriptRoot

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
} catch {
    Write-Host "Port $port is busy, falling back to port 3001..." -ForegroundColor Yellow
    $port = 3001
    $prefix = "http://localhost:$port/"
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add($prefix)
    $listener.Start()
}

Write-Host "Serving application at: $prefix" -ForegroundColor Green
Write-Host "Press Ctrl+C in this terminal window to stop the server.`n" -ForegroundColor Gray

# Open default browser
Start-Process $prefix

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".jsx"  = "text/plain; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".ico"  = "image/x-icon"
    ".txt"  = "text/plain; charset=utf-8"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawUrl = $request.Url.LocalPath
        if ($rawUrl -eq "/" -or [string]::IsNullOrEmpty($rawUrl)) {
            $rawUrl = "/index.html"
        }

        # Normalize relative path
        $decodedUrl = [System.Uri]::UnescapeDataString($rawUrl.TrimStart('/'))
        $filePath = Join-Path $baseDir $decodedUrl.Replace('/', [System.IO.Path]::DirectorySeparatorChar)

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = "application/octet-stream"
            if ($mimeTypes.ContainsKey($ext)) {
                $contentType = $mimeTypes[$ext]
            }

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200

            # CORS headers
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate")

            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 - File Not Found: $decodedUrl")
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }

        $response.Close()
    }
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
    $listener.Close()
    Write-Host "`nServer stopped." -ForegroundColor Yellow
}
