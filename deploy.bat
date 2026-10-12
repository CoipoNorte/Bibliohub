@echo off
chcp 65001 >nul
setlocal
title Bibliohub ^| Deploy automatico a GitHub Pages
cd /d "%~dp0"

set "REPO_URL=https://github.com/CoipoNorte/Bibliohub.git"
set "BASE=/Bibliohub/"
set "PAGES_URL=https://coiponorte.github.io/Bibliohub/"

echo ======================================================
echo   BIBLIOHUB - Deploy automatico a GitHub Pages
echo   Repo:  %REPO_URL%
echo   Sitio: %PAGES_URL%
echo ======================================================
echo.

REM ---- 1. Node y npm --------------------------------------
echo [1/6] Verificando Node.js y npm...
where node >nul 2>&1
if errorlevel 1 goto :nonode
where npm >nul 2>&1
if errorlevel 1 goto :nonode
echo   [OK] Node y npm detectados
echo.

REM ---- 2. Scripts en package.json --------------------------
echo [2/6] Preparando scripts predeploy y deploy...
node -e "const fs=require('fs');const p='package.json';const j=JSON.parse(fs.readFileSync(p,'utf8'));j.scripts=j.scripts||{};j.scripts.predeploy='npm run build';j.scripts.deploy='gh-pages -d dist';fs.writeFileSync(p,JSON.stringify(j,null,2)+'\n');"
if errorlevel 1 goto :fail
echo   [OK] package.json listo
echo.

REM ---- 3. Base en vite.config.ts ---------------------------
echo [3/6] Ajustando base %BASE% en vite.config.ts...
node -e "const fs=require('fs');const p='vite.config.ts';let s=fs.readFileSync(p,'utf8');const Q=String.fromCharCode(34);const bb='base: '+Q+'%BASE%'+Q+',';if(/base\s*:/.test(s)){s=s.replace(/base\s*:\s*[\u0022\u0027][^\u0022\u0027]*[\u0022\u0027]\s*,?/,bb)}else{s=s.replace(/defineConfig\s*\(\s*\{/,'defineConfig({\n  '+bb)}fs.writeFileSync(p,s);console.log('   base '+Q+'%BASE%'+Q+' aplicada')"
if errorlevel 1 goto :fail
echo   [OK] vite.config.ts apunta a %BASE%
echo.

REM ---- 4. gh-pages instalado -------------------------------
echo [4/6] Comprobando gh-pages...
node -e "const j=require('./package.json');const d=Object.assign({},j.dependencies,j.devDependencies);process.exit(d['gh-pages']?0:1)" >nul 2>&1
if errorlevel 1 (
  echo   Instalando gh-pages como devDependency...
  call npm i -D gh-pages
  if errorlevel 1 goto :fail
) else (
  echo   [OK] gh-pages ya instalado
)
echo.

REM ---- 5. Dependencias y build -----------------------------
echo [5/6] Instalando dependencias y compilando...
call npm install --no-audit --no-fund
if errorlevel 1 goto :fail
call npm run build
if errorlevel 1 goto :fail
if not exist dist\index.html goto :fail
echo   [OK] dist generado
echo.

REM ---- 6. Git + publicacion en gh-pages --------------------
echo [6/6] Sincronizando git y publicando...

git config user.email >nul 2>&1
if errorlevel 1 goto :noidentity

if not exist .git (
  echo   Inicializando repositorio git...
  git init
  if errorlevel 1 goto :fail
  git add .
  git commit -m "Bibliohub: biblioteca personal de proyectos"
  if errorlevel 1 goto :fail
  git branch -M main
  if errorlevel 1 goto :fail
)

git remote get-url origin >nul 2>&1
if errorlevel 1 (
  echo   Conectando origin con %REPO_URL%
  git remote add origin %REPO_URL%
  if errorlevel 1 goto :fail
)

git push -u origin main >nul 2>&1
if errorlevel 1 (
  echo   [AVISO] main no subio - posible pull pendiente.
  echo   Primera vez: git pull origin main --rebase
  echo   y luego:     git push -u origin main
) else (
  echo   [OK] main sincronizado con origin
)

call npm run deploy
if errorlevel 1 goto :fail

echo.
echo ======================================================
echo   PUBLICADO: %PAGES_URL%
echo.
echo   Primer despliegue ^(solo una vez^):
echo   1. Abre https://github.com/CoipoNorte/Bibliohub/settings/pages
echo   2. Source: rama gh-pages - carpeta / ^(root^) - Save
echo   3. Espera 1-2 minutos y abre la web - Ctrl+F5 recarga forzada
echo ======================================================
pause
goto :eof

:nonode
echo.
echo [ERROR] Node.js no esta instalado o no esta en el PATH.
echo   Descargalo en https://nodejs.org y vuelve a ejecutar este script.
pause
exit /b 1

:noidentity
echo.
echo [ERROR] git no tiene identidad configurada. Ejecuta una vez:
echo   git config --global user.name "Tu Nombre"
echo   git config --global user.email "tu@email.com"
pause
exit /b 1

:fail
echo.
echo [ERROR] Algo fallo durante el despliegue. Revisa los mensajes de arriba.
pause
exit /b 1
