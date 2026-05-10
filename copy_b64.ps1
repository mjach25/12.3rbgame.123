# Read the favicon base64
$favB64 = (Get-Content "C:\Users\achra\OneDrive\Desktop\sit game\favicon_b64.txt" -Raw).Trim()

# Build the replacement href value (just the base64 data URI)
$newHref = "data:image/png;base64,$favB64"

# Copy it to clipboard so browser can paste it
Set-Clipboard -Value $newHref

Write-Host "Copied to clipboard! Length: $($newHref.Length)"
Write-Host "First 50 chars: $($newHref.Substring(0, 50))"
