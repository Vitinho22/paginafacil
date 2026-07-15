@echo off
title PaginaFacil - Instalar e iniciar
cd /d "%~dp0"

echo.
echo ============================================
echo   PAGINAFACIL - PREPARANDO O PROJETO
echo ============================================
echo.

if exist tailwind.config.js del /f /q tailwind.config.js
if exist tailwind.config.ts del /f /q tailwind.config.ts
if exist .next rmdir /s /q .next

echo Instalando dependencias...
call npm install
if errorlevel 1 (
  echo.
  echo Nao foi possivel instalar as dependencias.
  pause
  exit /b 1
)

echo.
echo Iniciando o PaginaFacil...
call npm run dev
pause
