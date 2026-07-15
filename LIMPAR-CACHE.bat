@echo off
title PaginaFacil - Limpar cache
cd /d "%~dp0"

if exist postcss.config.mjs del /f /q postcss.config.mjs
if exist postcss.config.js del /f /q postcss.config.js
if exist tailwind.config.js del /f /q tailwind.config.js
if exist tailwind.config.ts del /f /q tailwind.config.ts
if exist .next rmdir /s /q .next

echo Cache e configuracoes antigas removidos.
pause
