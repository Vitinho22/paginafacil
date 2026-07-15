$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  CONFIGURAR MERCADO PAGO - PAGINAFACIL" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
$token = Read-Host "Cole o Access Token do Mercado Pago"
$site = Read-Host "Digite o endereco do site (ex.: https://seudominio.com)"
$modo = Read-Host "Usar modo de TESTE? Digite S para sim ou N para pagamentos reais"
$sandbox = if ($modo.Trim().ToUpper() -eq "N") { "false" } else { "true" }

$envPath = Join-Path $PSScriptRoot ".env.local"
$content = if (Test-Path $envPath) { Get-Content $envPath -Raw } else { "" }

function Set-EnvValue([string]$text, [string]$key, [string]$value) {
  $pattern = "(?m)^" + [regex]::Escape($key) + "=.*$"
  $line = "$key=$value"
  if ($text -match $pattern) { return [regex]::Replace($text, $pattern, $line) }
  return ($text.TrimEnd() + "`r`n" + $line + "`r`n")
}

$content = Set-EnvValue $content "MERCADO_PAGO_ACCESS_TOKEN" $token.Trim()
$content = Set-EnvValue $content "NEXT_PUBLIC_SITE_URL" $site.Trim().TrimEnd('/')
$content = Set-EnvValue $content "MERCADO_PAGO_SANDBOX" $sandbox
Set-Content -Path $envPath -Value $content -Encoding UTF8

if (Test-Path ".next") { Remove-Item ".next" -Recurse -Force }
Write-Host ""
Write-Host "Pagamento configurado com sucesso." -ForegroundColor Green
Write-Host "Agora execute INSTALAR-E-INICIAR.bat para testar." -ForegroundColor Yellow
Read-Host "Pressione ENTER para fechar"
