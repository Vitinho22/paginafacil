@echo off
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0CONFIGURAR-PAGAMENTO.ps1"
