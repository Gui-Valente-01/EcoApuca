@echo off
title EcoApuca - Servidor local
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo O Node.js nao foi encontrado neste computador.
  echo Instale o Node.js 22 ou mais recente em https://nodejs.org/
  echo Depois, execute este arquivo novamente.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Instalando os componentes do EcoApuca. Aguarde...
  call npm.cmd install
  if errorlevel 1 (
    echo Nao foi possivel instalar os componentes.
    pause
    exit /b 1
  )
)

echo.
echo EcoApuca sera iniciado em http://localhost:3000
echo Para encerrar, pressione Ctrl+C nesta janela.
echo.
start "" "http://localhost:3000"
call npm.cmd run dev
