@echo off
setlocal
cd /d "%~dp0"
title PaginaFacil - Corrigir Tailwind e iniciar

echo.
echo ================================================
echo   CORRIGINDO CONFIGURACAO ANTIGA DO TAILWIND
echo ================================================
echo.

if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

REM O projeto usa CSS puro. Recria uma configuracao PostCSS segura.
(
  echo const config = { plugins: {} };
  echo export default config;
) > postcss.config.mjs

if not exist node_modules (
  echo Instalando dependencias do projeto...
  call npm install
  if errorlevel 1 goto :erro
)

echo.
echo Iniciando o projeto...
call npm run dev
goto :fim

:erro
echo.
echo Nao foi possivel instalar as dependencias.
echo Confira sua internet e execute novamente este arquivo.
pause
exit /b 1

:fim
pause
endlocal
