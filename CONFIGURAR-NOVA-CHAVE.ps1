$ErrorActionPreference = "Stop"
$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$envFile = Join-Path $projectDir ".env.local"

Write-Host "" 
Write-Host "CONFIGURACAO SEGURA DA IA - PAGINAFACIL" -ForegroundColor Cyan
Write-Host "A chave enviada no chat deve ser revogada. Use uma NOVA chave." -ForegroundColor Yellow
Write-Host ""

$key = Read-Host "Cole sua NOVA chave da OpenAI"
if ([string]::IsNullOrWhiteSpace($key) -or -not $key.StartsWith("sk-")) {
  Write-Host "Chave invalida. Ela normalmente comeca com sk-." -ForegroundColor Red
  Read-Host "Pressione Enter para fechar"
  exit 1
}

$content = @()
if (Test-Path $envFile) { $content = Get-Content $envFile }
$content = $content | Where-Object { $_ -notmatch '^OPENAI_API_KEY=' -and $_ -notmatch '^OPENAI_IMAGE_MODEL=' }
$content += "OPENAI_API_KEY=$key"
$content += "OPENAI_IMAGE_MODEL=gpt-image-1.5"
Set-Content -Path $envFile -Value $content -Encoding UTF8

Write-Host "" 
Write-Host "Chave configurada com sucesso no arquivo .env.local." -ForegroundColor Green
Write-Host "Agora execute INICIAR-PAGINAFACIL.bat" -ForegroundColor Green
Read-Host "Pressione Enter para fechar"

OPENAI_TEXT_MODEL=gpt-4.1-mini
