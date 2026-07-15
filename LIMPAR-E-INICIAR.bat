@echo off
cd /d "%~dp0"
title PaginaFacil - Inicio corrigido

echo Fechando processos antigos...
taskkill /F /IM node.exe >nul 2>&1

echo Limpando arquivos antigos do Next.js...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo Instalando dependencias...
call npm install
if errorlevel 1 goto erro

echo Iniciando sem Turbopack para evitar erro de Client Manifest...
call npm run dev
goto fim

:erro
echo Nao foi possivel instalar as dependencias.
pause
exit /b 1

:fim
pause
