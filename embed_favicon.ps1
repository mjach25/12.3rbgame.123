$favB64 = Get-Content "C:\Users\achra\OneDrive\Desktop\sit game\favicon_b64.txt" -Raw
$favB64 = $favB64.Trim()

$html = Get-Content "C:\Users\achra\OneDrive\Desktop\sit game\index.html" -Raw -Encoding UTF8

# Replace old favicon lines with base64 embedded
$oldIcon = @'
    <link rel="icon" type="image/png" href="data:image/png;base64,
'@

# Check if already has base64 favicon
if ($html -match 'data:image/png;base64,') {
    Write-Host "Already has base64 favicon - updating it"
    # Replace from <link rel="icon" to the end of the apple-touch-icon line
    $html = $html -replace '(?s)    <link rel="icon" type="image/png" href="data:image/png;base64,[^"]*">[\r\n]+    <link rel="apple-touch-icon" href="data:image/png;base64,[^"]*">[\r\n]+', "    <link rel=`"icon`" type=`"image/png`" href=`"data:image/png;base64,$favB64`">`r`n    <link rel=`"apple-touch-icon`" href=`"data:image/png;base64,$favB64`">`r`n"
} else {
    Write-Host "Inserting base64 favicon"
    $html = $html -replace '    <link rel="icon" type="image/png" href="1010.png">\r?\n    <link rel="apple-touch-icon" href="1010.png">', "    <link rel=`"icon`" type=`"image/png`" href=`"data:image/png;base64,$favB64`">`r`n    <link rel=`"apple-touch-icon`" href=`"data:image/png;base64,$favB64`">`r`n"
}

[System.IO.File]::WriteAllText("C:\Users\achra\OneDrive\Desktop\sit game\index.html", $html, [System.Text.Encoding]::UTF8)
Write-Host "Done! File updated successfully"
