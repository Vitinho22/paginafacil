@echo off
setlocal
cd /d "%~dp0"
title PaginaFacil Premium

echo ==========================================
echo      PAGINAFACIL PREMIUM 6.0
echo ==========================================
echo.

taskkill /F /IM node.exe >nul 2>&1
if exist .next rmdir /s /q .next

echo Instalando dependencias...
call npm install
if errorlevel 1 goto erro

echo.
echo Iniciando a plataforma...
call npm run dev
goto fim

:erro
echo.
echo Nao foi possivel instalar as dependencias.
echo Confira sua internet e se o Node.js esta instalado.
pause
exit /b 1

:fim
pause
endlocal
