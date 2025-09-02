param(
    [string]$BaseUrl = "http://localhost:3000"
)

function IsExpectedStatus([string]$path, [int]$code) {
    switch ($path) {
        "/404" { return ($code -eq 404 -or $code -eq 200) }
        "/does-not-exist-xyz" { return ($code -eq 404) }
        default { return ($code -ge 200 -and $code -lt 400) }
    }
}

$paths = @(
    "/",
    "/home",
    "/categories",
    "/banca",
    "/privacy-policy",
    "/refund-policy",
    "/shipping-policy",
    "/404",
    "/does-not-exist-xyz"
)

$ok = 0
$fail = 0

Write-Host ("Iniciando smoke tests em {0} ..." -f $BaseUrl)
foreach ($path in $paths) {
    $u = "$BaseUrl$path"
    $code = 0
    $errMsg = $null
    try {
        $resp = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 15
        $code = [int]$resp.StatusCode
    } catch {
        if ($_.Exception.Response) {
            try { $code = [int]$_.Exception.Response.StatusCode.value__ } catch { $code = 0 }
            $errMsg = $_.Exception.Message
        } else {
            $code = 0
            $errMsg = $_.Exception.Message
        }
    }

    $expected = IsExpectedStatus -path $path -code $code
    if ($expected) {
        $ok++
        Write-Host ("OK  {0} -> {1}" -f $code, $u)
    } else {
        $fail++
        Write-Host ("ERR {0} -> {1} {2}" -f $code, $u, $(if ($errMsg) {"- " + $errMsg} else {""}))
    }
}

Write-Host ("Resumo: OK={0} | FAIL={1}" -f $ok, $fail)
if ($fail -gt 0) { exit 1 } else { exit 0 }