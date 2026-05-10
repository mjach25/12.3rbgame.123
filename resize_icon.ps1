Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\achra\OneDrive\Desktop\sit game\1010.png"
$dstPath = "C:\Users\achra\OneDrive\Desktop\sit game\favicon.png"

$src = [System.Drawing.Image]::FromFile($srcPath)
$dst = New-Object System.Drawing.Bitmap(64, 64)
$g = [System.Drawing.Graphics]::FromImage($dst)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($src, 0, 0, 64, 64)
$dst.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Png)
$src.Dispose()
$dst.Dispose()
$g.Dispose()

$size = (Get-Item $dstPath).Length
Write-Host "Done! favicon.png size: $size bytes"
