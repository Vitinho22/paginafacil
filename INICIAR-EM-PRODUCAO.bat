@echo off
setlocal
cd /d "%~dp0"
title PaginaFacil - Modo Producao

echo.
echo ==========================================
echo   PAGINAFACIL - INICIANDO EM PRODUCAO
echo ==========================================
echo.

taskkill /F /IM node.exe >nul 2>&1
if exist .next rmdir /s /q .next

echo Instalando dependencias...
call npm install
if errorlevel 1 goto :erro

echo.
echo Criando versao otimizada...
call npm run build
if errorlevel 1 goto :erro

echo.
echo Abrindo em http://localhost:3000
start "" http://localhost:3000
call npm start
goto :fim

:erro
echo.
echo Nao foi possivel iniciar. Leia o erro acima.
pause
exit /b 1

:fim
pause
endlocal
