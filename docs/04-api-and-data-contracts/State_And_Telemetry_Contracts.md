# Contratos de Estado y Telemetría Forense — EvaluaTI-ON_Killua_V1.0

Este documento especifica los contratos de datos formales exportados por `@evaluati-on/shared-types` y `@evaluati-on/telemetry-sdk`.

---

## 1. Contrato `InfrastructureState` (Shadow State JSON)

El estado global de la simulación se estructura de la siguiente manera:

- `sessionId` (`string`): Identificador único de la sesión de evaluación.
- `activePlatform` (`PlatformLayerId`): Capa activa (`L1_XCLARITY_BMC`, `L2_VCENTER_ESXI8`, `L3_RHEL8_LINUX`, `L3_WIN2019_SERVER`, `L4_FORTIGATE_761`).
- `roleMode` (`WorkspaceRoleMode`): `'CANDIDATE_MODE'` o `'RECRUITER_ARCHITECT_MODE'`.
- `missionQueue` (`ChallengeMissionTicket[]`): Cola secuencial de misiones asignadas a la evaluación.
- `currentMissionIndex` (`number`): Índice basado en cero de la misión en curso.
- `crossLayerAlerts` (`CrossLayerAlert[]`): Alertas propagadas entre capas (por ejemplo, degradación de un disco físico en `xclarityL1` que impacta un datastore en `vcenterL2` y remonta en solo lectura un volumen LVM en `rhel8L3`).
- `shells`:
  - `xclarityL1` (`XClarityL1ShellState`): Sensores térmicos, fuentes de poder redundantes, discos físicos RAID y registros del BMC.
  - `vcenterL2` (`VCenterL2ShellState`): Nodos ESXi 8.0, datastores, máquinas virtuales y portgroups distribuidos.
  - `rhel8L3` (`Rhel8L3ShellState`): Unidades `systemd`, interfaces `nmcli`, volúmenes LVM, zonas `firewalld`, archivos virtuales con contexto SELinux y entradas de `journalctl`.
  - `win2019L3` (`Win2019L3ShellState`): Servicios de Windows, salud de Active Directory y replicación SYSVOL, pools de IIS, adaptadores de red, Event Viewer y claves de registro.
  - `fortigateL4` (`FortiGateL4ShellState`): Interfaces por VDOM, políticas de firewall IPv4, túneles IPsec, monitores SLA de SD-WAN y rutas estáticas.

---

## 2. Contrato de Ejecución `CommandExecutionResponse`

Toda acción ejecutada por el candidato produce una respuesta inmutable con la siguiente firma:

| Propiedad | Tipo | Descripción |
| :--- | :--- | :--- |
| `commandRaw` | `string` | Comando CLI exacto o identificador de acción GUI ejecutada. |
| `stdout` | `string` | Salida estándar emulada. |
| `stderr` | `string` | Salida de error estándar emulada. |
| `exitCode` | `number` | Código de retorno (`0` éxito, `!= 0` error). |
| `resolvedBy` | `'FAST_PATH_LOCAL' \| 'OLLAMA_MECHANICAL' \| 'GEMINI_LOGICAL'` | Motor que resolvió la ejecución. |
| `latencyMs` | `number` | Tiempo de resolución en milisegundos. |
| `actionClassification` | `'DIAGNOSTIC' \| 'CONFIGURATION' \| 'DESTRUCTIVE' \| 'INVALID_SYNTAX'` | Naturaleza operativa del comando. |
| `systemImpact` | `'NONE' \| 'LOW' \| 'MEDIUM' \| 'HIGH' \| 'CRITICAL_OUTAGE'` | Nivel de impacto sobre la disponibilidad del servicio. |
| `updatedState` | `InfrastructureState` | Nuevo Shadow State JSON resultante. |
| `checkpointReached` | `string \| undefined` | Identificador opcional del hito intermedio alcanzado. |
| `challengeCompleted` | `boolean` | Indica si se cumplieron todos los objetivos de la misión. |

---

## 3. Contrato Forense `TelemetryEvent` y `ExecutiveTelemetryMetrics`

Cada interacción genera un `TelemetryEvent` persistido en la línea de tiempo forense (`evaluation_telemetry` en MySQL) y procesado en memoria por `TelemetryCollector`:

- **Detección Anti-Cheat**:
  - `typingCadenceWpm`: Velocidad de escritura medida en palabras por minuto sobre la ventana de pulsaciones reales previas al `Enter`.
  - `clipboardPasteDetected`: Bandera booleana activada cuando el comando incluye contenido inyectado vía evento `paste`.
- **Métricas Ejecutivas (`ExecutiveTelemetryMetrics`)**:
  - `timeToResolutionSeconds`: Segundos transcurridos desde el inicio de la sesión hasta la resolución del incidente.
  - `errorRatePct`: Porcentaje de comandos con `exitCode !== 0` o `INVALID_SYNTAX`.
  - `diagnosticToActionRatio`: Proporción de comandos `DIAGNOSTIC` frente a comandos `CONFIGURATION` + `DESTRUCTIVE`.
  - `destructiveActionsCount`: Conteo acumulado de acciones destructivas o con impacto `CRITICAL_OUTAGE`.
  - `operationalCertaintyScore`: Índice compuesto (`0` a `100`) que cuantifica la certeza operacional del candidato.
