$bytes = [System.IO.File]::ReadAllBytes("C:\Users\achra\OneDrive\Desktop\sit game\favicon.png")
$b64 = [System.Convert]::ToBase64String($bytes)
$b64 | Out-File "C:\Users\achra\OneDrive\Desktop\sit game\favicon_b64.txt" -Encoding ASCII
Write-Host "Done! Length: $($b64.Length)"
