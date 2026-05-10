# Read the favicon base64
$favB64 = (Get-Content "C:\Users\achra\OneDrive\Desktop\sit game\favicon_b64.txt" -Raw).Trim()
$imgSrc = "data:image/png;base64,$favB64"

# Read the full HTML
$html = [System.IO.File]::ReadAllText("C:\Users\achra\OneDrive\Desktop\sit game\index.html", [System.Text.Encoding]::UTF8)

# Replace navbar logo-box (line 650) - replace the gamepad icon with img
$oldNavLogo = '<div class="logo-box"><i class="fas fa-gamepad" style="color:#fff; font-size:22px;"></i></div>'
$newNavLogo = "<div class=`"logo-box`" style=`"padding:0;overflow:hidden;`"><img src=`"$imgSrc`" style=`"width:100%;height:100%;object-fit:cover;display:block;`" alt=`"3rbgame`"></div>"

# Replace footer logo-box - has different icon size
$oldFootLogo = '<div class="logo-box"><i class="fas fa-gamepad" style="color:#fff; font-size:22px;"></i></div>'

$html = $html.Replace($oldNavLogo, $newNavLogo)

# Also fix auth modal logo
$oldAuthLogo = '<div class="logo-box" style="width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,var(--primary),var(--cyan));display:flex;align-items:center;justify-content:center;font-size:14px;"><i class="fas fa-gamepad" style="color:#fff; font-size:16px;"></i></div>'
$newAuthLogo = "<div class=`"logo-box`" style=`"width:30px;height:30px;border-radius:8px;padding:0;overflow:hidden;`"><img src=`"$imgSrc`" style=`"width:100%;height:100%;object-fit:cover;display:block;`" alt=`"3rbgame`"></div>"
$html = $html.Replace($oldAuthLogo, $newAuthLogo)

[System.IO.File]::WriteAllText("C:\Users\achra\OneDrive\Desktop\sit game\index.html", $html, [System.Text.Encoding]::UTF8)

# Count replacements
$count = ([regex]::Matches($html, [regex]::Escape($imgSrc))).Count
Write-Host "Done! Image appears $count times in HTML"
