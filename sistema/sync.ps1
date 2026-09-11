<#
.SYNOPSIS
  Copia el sistema de diseño Adcom a los repos de cliente.

.DESCRIPTION
  adcom/sistema/ es la fuente de verdad. Este script copia adcom.css y adcom.js
  a assets/css/ y assets/js/ de cada repo, y reporta qué cambió.

  Las copias son generadas: editarlas es perder el cambio en el siguiente sync.

.PARAMETER Repos
  Solo estos repos. Sin el parámetro, todos los del ámbito.

.PARAMETER DryRun
  Reporta qué haría y no escribe nada.

.EXAMPLE
  .\sync.ps1
  .\sync.ps1 -Repos cesde,raza
  .\sync.ps1 -DryRun

.NOTES
  loyevo queda fuera por decisión del cliente interno.
  otros queda fuera: es un repo de borrador.
#>
[CmdletBinding()]
param(
  [string[]]$Repos,
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'

# ---------------------------------------------------------------- ámbito ---
# Si agregas un repo a la organización, súmalo aquí.
$AmbitoCompleto = @(
  'adcom','betplay','catolica','cesde','compensar','corpas','eia',
  'gana','genius','raza','ris','uan','yajuego'
)
$FueraDeAmbito = @{
  'loyevo'    = 'fuera por decisión del cliente interno'
  'otros'     = 'repo de borrador'
  'westfield' = 'fuera por decisión del cliente interno: conserva su diseño propio'
}

# ------------------------------------------------------------- ubicación ---
$Sistema = $PSScriptRoot
$Raiz    = Split-Path (Split-Path $Sistema -Parent) -Parent   # ...\GitHub

# ------------------------------------------- generar adcom-tokens.css ---
# adcom.css trae reglas de elemento desnudo (table, img, h1..h4, p, a) que un
# documento legado NO puede recibir encima: le moveria tablas y titulares que
# ya estaban resueltos a mano. Esos documentos enlazan solo los tokens.
# Se EXTRAE de adcom.css, no se mantiene aparte: una sola fuente de verdad.
$FuenteCss = Get-Content (Join-Path $Sistema 'adcom.css') -Raw -Encoding UTF8

function Extraer($texto, $desde, $hasta) {
  $i = $texto.IndexOf($desde)
  $j = $texto.IndexOf($hasta)
  if ($i -lt 0 -or $j -lt 0 -or $j -le $i) {
    throw "No encuentro las marcas $desde .. $hasta en adcom.css"
  }
  # El marcador es un comentario que ocupa varias lineas. Hay que arrancar
  # DESPUES de cerrarlo: si se arranca en la linea siguiente, el generado
  # empieza a mitad de comentario y con un */ huerfano, y el parser de CSS
  # se come el primer bloque entero (el :root) en su recuperacion de error.
  $cierre = $texto.IndexOf('*/', $i)
  if ($cierre -lt 0 -or $cierre -gt $j) {
    throw "El marcador $desde no cierra su comentario antes de $hasta"
  }
  $i = $cierre + 2
  return $texto.Substring($i, $j - $i).Trim()
}

$Tokens      = Extraer $FuenteCss '/* @tokens:inicio' '/* @tokens:fin */'
$Portada     = Extraer $FuenteCss '/* @portada:inicio' '/* @portada:fin */'
$Cuerpo      = Extraer $FuenteCss '/* @cuerpo:inicio' '/* @cuerpo:fin */'
$Tipografia  = Extraer $FuenteCss '/* @tipografia:inicio' '/* @tipografia:fin */'
$TokensPrint = Extraer $FuenteCss '/* @tokens-print:inicio */' '/* @tokens-print:fin */'

$Cabecera = @'
/* ============================================================================
   Sistema de diseno Adcom . SOLO TOKENS
   ----------------------------------------------------------------------------
   GENERADO. No lo edites: sync.ps1 lo reescribe extrayendolo de adcom.css,
   que es la fuente de verdad. Para cambiar un token, cambialo alla.

   Que es esto y por que existe
   ----------------------------
   Los documentos de cliente que ya estaban escritos traen su propio CSS
   completo, con sus tablas, sus titulares y sus tarjetas resueltos a mano.
   adcom.css declara reglas sobre elementos desnudos (table, img, h1..h4, p,
   a): enlazarlo en uno de esos documentos le cambiaria cosas que ya estaban
   bien. Este archivo trae los tokens y NADA mas.

   Como se usa
   -----------
   1. En el <head>, ANTES del <style> propio del documento:
        <link rel="stylesheet" href="assets/css/adcom-tokens.css">
   2. En el :root del documento, apuntar sus tokens propios a los del sistema:
        --yellow:var(--accent);  --gray-400:var(--fg-muted);  ...
      Asi cada regla que ya existia resuelve al color y a la forma de la casa
      sin reescribir una sola de esas reglas.

   Ademas de los tokens, este archivo trae la familia tipografica (la unica
   regla de elemento desnudo, sobre `body`, porque la tipografia es justo lo
   que se quiere estandarizar), la .portada y seis componentes de cuerpo.
   Es la pieza que fija el caracter del documento y esta acotada por clase
   (ni un selector de elemento desnudo), asi que es seguro adoptarla en un
   documento legado. Ver DESIGN.md, 'La portada'.

   Un documento NUEVO no usa este archivo: enlaza adcom.css completo.
   ========================================================================= */

'@

$RutaTokens = Join-Path $Sistema 'adcom-tokens.css'
$NL         = [string][char]13 + [char]10
$Contenido  = $Cabecera + $Tokens + $NL + $NL + '@media print{' + $NL + $TokensPrint + $NL + '}' + $NL +
              $NL + '/* ====================== COMPONENTE: PORTADA ====================== */' + $NL +
              $Portada + $NL +
              $NL + '/* ================== TIPOGRAFIA ================== */' + $NL +
              $Tipografia + $NL +
              $NL + '/* ============== COMPONENTES DE CUERPO ============== */' + $NL +
              $Cuerpo + $NL
[System.IO.File]::WriteAllText($RutaTokens, $Contenido, (New-Object System.Text.UTF8Encoding $false))
Write-Host ("  adcom-tokens.css generado ({0} lineas)" -f ($Contenido -split [char]10).Count) -ForegroundColor DarkGray

$Archivos = @(
  @{ Origen = 'adcom.css';        Destino = 'assets\css\adcom.css' }
  @{ Origen = 'adcom-tokens.css'; Destino = 'assets\css\adcom-tokens.css' }
  @{ Origen = 'adcom.js';         Destino = 'assets\js\adcom.js'  }
)

foreach ($a in $Archivos) {
  $p = Join-Path $Sistema $a.Origen
  if (-not (Test-Path $p)) {
    throw "No encuentro la fuente: $p"
  }
}

# --------------------------------------------------------------- selección ---
if ($Repos) {
  $Objetivo = @()
  foreach ($r in $Repos) {
    if ($FueraDeAmbito.ContainsKey($r)) {
      Write-Host "  $r omitido: $($FueraDeAmbito[$r])" -ForegroundColor DarkYellow
      continue
    }
    if ($AmbitoCompleto -notcontains $r) {
      Write-Host "  $r no está en el ámbito. Agrégalo a `$AmbitoCompleto en sync.ps1" -ForegroundColor DarkYellow
      continue
    }
    $Objetivo += $r
  }
} else {
  $Objetivo = $AmbitoCompleto
}

if (-not $Objetivo) {
  Write-Host "Nada que sincronizar." -ForegroundColor Yellow
  exit 0
}

# ------------------------------------------------------------------ sync ---
if ($DryRun) {
  Write-Host ""
  Write-Host "DRY RUN. No se escribe nada." -ForegroundColor Cyan
}
Write-Host ""

$Actualizados = @()
$SinCambio    = 0
$NoEncontrado = @()

foreach ($repo in $Objetivo) {
  $repoPath = Join-Path $Raiz $repo

  if (-not (Test-Path $repoPath)) {
    $NoEncontrado += $repo
    continue
  }

  $cambiosRepo = @()

  foreach ($a in $Archivos) {
    $origen  = Join-Path $Sistema $a.Origen
    $destino = Join-Path $repoPath $a.Destino
    $carpeta = Split-Path $destino -Parent

    $hashOrigen = (Get-FileHash $origen -Algorithm SHA256).Hash
    $existe     = Test-Path $destino

    if ($existe) {
      $hashDestino = (Get-FileHash $destino -Algorithm SHA256).Hash
      if ($hashOrigen -eq $hashDestino) {
        $SinCambio++
        continue
      }
      $accion = 'actualiza'
    } else {
      $accion = 'crea'
    }

    $cambiosRepo += "$accion $($a.Destino)"

    if (-not $DryRun) {
      if (-not (Test-Path $carpeta)) {
        New-Item -ItemType Directory -Path $carpeta -Force | Out-Null
      }
      Copy-Item $origen $destino -Force
    }
  }

  if ($cambiosRepo.Count -gt 0) {
    $Actualizados += $repo
    Write-Host ("  {0,-11} " -f $repo) -NoNewline -ForegroundColor White
    Write-Host ($cambiosRepo -join ', ') -ForegroundColor Green
  }
}

# ---------------------------------------------------------------- reporte ---
Write-Host ""
if ($Actualizados.Count -eq 0) {
  Write-Host "Todo al día. $SinCambio archivo(s) ya coincidían." -ForegroundColor Green
} else {
  $verbo = 'Sincronizados'
  if ($DryRun) { $verbo = 'Se sincronizarían' }
  Write-Host "$verbo $($Actualizados.Count) repo(s). $SinCambio archivo(s) ya coincidían." -ForegroundColor Green
}

if ($NoEncontrado.Count -gt 0) {
  Write-Host ""
  Write-Host "No encontré estas carpetas en $Raiz :" -ForegroundColor Yellow
  Write-Host "  $($NoEncontrado -join ', ')" -ForegroundColor Yellow
  Write-Host "  Clónalos, o quítalos de `$AmbitoCompleto en sync.ps1." -ForegroundColor DarkGray
}

if ($Actualizados.Count -gt 0 -and -not $DryRun) {
  Write-Host ""
  Write-Host "Falta commitear en cada repo tocado:" -ForegroundColor Cyan
  foreach ($repo in $Actualizados) {
    Write-Host "  cd `"$(Join-Path $Raiz $repo)`"; git add assets; git commit -m `"Sincroniza sistema de diseño`"" -ForegroundColor DarkGray
  }
}
Write-Host ""
