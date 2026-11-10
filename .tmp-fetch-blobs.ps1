$ErrorActionPreference = 'Continue'
$repo = 'XY-COMBINATOR/XY-COMBINATOR'
$commit = 'b101bba'
$skipMp4 = $args -contains '-SkipMp4'
$tmpdir = $env:TEMP
$ProgressPreference = 'SilentlyContinue'

$tree = Invoke-RestMethod -Uri "https://api.github.com/repos/$repo/git/trees/$commit`?recursive=1" -Headers @{ 'User-Agent' = 'opencode' } -TimeoutSec 120
$blobs = $tree.tree | Where-Object { $_.type -eq 'blob' }

$local = @{}
& git cat-file --batch-check --batch-all-objects 2>$null | ForEach-Object {
  $p = $_ -split ' '
  if ($p.Count -ge 2 -and $p[1] -eq 'blob') { $local[$p[0]] = $true }
}

$missing = $blobs | Where-Object { -not $local.ContainsKey($_.sha) }
if ($skipMp4) { $missing = $missing | Where-Object { $_.path -notlike '*.mp4' } }

Write-Output ("To fetch: " + $missing.Count + " files, " + [math]::Round((($missing | Measure-Object size -Sum).Sum / 1MB), 2) + " MB")

$ok = 0
$fail = 0
foreach ($b in $missing) {
  $enc = (($b.path -split '/') | ForEach-Object { [uri]::EscapeDataString($_) }) -join '/'
  $url = "https://raw.githubusercontent.com/$repo/$commit/$enc"
  $tmp = Join-Path $tmpdir ([guid]::NewGuid().ToString() + '.tmp')
  & curl.exe -sSL --retry 5 --retry-all-errors -o $tmp $url
  if ($LASTEXITCODE -ne 0 -or -not (Test-Path $tmp)) {
    Write-Output ("FAIL download " + $b.path)
    $fail++
    continue
  }
  $got = (& git hash-object -w -- $tmp).Trim()
  if ($got -ne $b.sha) {
    Write-Output ("FAIL hash " + $b.path + " exp=" + $b.sha + " got=" + $got)
    $fail++
    Remove-Item $tmp -Force -ErrorAction SilentlyContinue
    continue
  }
  Remove-Item $tmp -Force -ErrorAction SilentlyContinue
  $ok++
  Write-Output ("OK " + $b.path)
}
Write-Output ("DONE ok=$ok fail=$fail")
