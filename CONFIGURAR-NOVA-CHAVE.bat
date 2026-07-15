@echo off
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0CONFIGURAR-NOVA-CHAVE.ps1"
