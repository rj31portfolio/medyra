$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$projectRoot = Split-Path $PSScriptRoot -Parent
$page = [System.IO.File]::ReadAllText((Join-Path $projectRoot 'oncology.html'))
$paths = [regex]::Matches($page, '"([^"\r\n]+/[^"\r\n]+\.png)"') |
    ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object MimeType -eq 'image/jpeg'
$parameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
$parameters.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [long]85)
$originalBytes = 0
$optimizedBytes = 0
foreach ($relativePath in $paths) {
    $sourcePath = Join-Path $projectRoot ('images/Oncology/' + $relativePath)
    if (-not (Test-Path -LiteralPath $sourcePath)) { continue }
    $destination = Join-Path $projectRoot ('images/oncology-optimized/' + [System.IO.Path]::ChangeExtension($relativePath, '.jpg'))
    [System.IO.Directory]::CreateDirectory((Split-Path $destination -Parent)) | Out-Null
    $source = [System.Drawing.Image]::FromFile($sourcePath)
    $scale = [Math]::Min(1.0, 720.0 / [Math]::Max($source.Width, $source.Height))
    $bitmap = [System.Drawing.Bitmap]::new([int][Math]::Round($source.Width * $scale), [int][Math]::Round($source.Height * $scale))
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    try {
        $graphics.Clear([System.Drawing.Color]::White)
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graphics.DrawImage($source, 0, 0, $bitmap.Width, $bitmap.Height)
        $bitmap.Save($destination, $encoder, $parameters)
    } finally {
        $graphics.Dispose()
        $bitmap.Dispose()
        $source.Dispose()
    }
    $originalBytes += (Get-Item -LiteralPath $sourcePath).Length
    $optimizedBytes += (Get-Item -LiteralPath $destination).Length
}
$parameters.Dispose()
Write-Output "Product image bytes: $originalBytes -> $optimizedBytes"
