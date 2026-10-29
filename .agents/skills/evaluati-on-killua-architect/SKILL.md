---
name: evaluati-on-killua-architect
description: Reglas institucionales para cascarones vacíos reactivos, Doble IA Ollama+Gemini y contrato Shadow State JSON de EvaluaTI-ON_Killua_V1.0
---

# Gobernanza Arquitectónica Institucional — EvaluaTI-ON_Killua_V1.0

Este documento define las invariantes innegociables de ingeniería que todo agente autónomo, desarrollador o revisor debe cumplir al construir o modificar cualquier paquete, micro-aplicación (`apps/*`) o servicio (`services/*`) dentro del monorepo `EvaluaTI-ON_Killua_V1.0`.

---

## 1. Filosofía de "Juego de Exploración" (Cascarón Vacío Reactivo)

1. **Prohibición Absoluta de Hardcoding Operativo**:
   - Está estrictamente prohibido codificar en duro nombres de servidores, direcciones IP, estados de servicios (`systemd`, Windows Services), tablas de enrutamiento, políticas de firewall, discos físicos o métricas de telemetría dentro de los componentes React o controladores locales.
   - Todo aplicativo en `apps/*` (`xclarity-app`, `vcenter-server-app`, `rhel-8-gui-app`, `windows-server-app`, `fortigate-app`) es un **Cascarón Vacío Reactivo** (*Reactive Empty Shell*).
2. **Única Fuente de Verdad (`InfrastructureState`)**:
   - Toda vista gráfica (GUI) y todo emulador de terminal (CLI) lee y proyecta exclusivamente el estado tipado `InfrastructureState` importado desde `@evaluati-on/shared-types`.
   - Cuando el estado se inicializa con `INITIAL_EMPTY_INFRASTRUCTURE_STATE`, el cascarón se monta sin datos espurios, listo para recibir la hidratación selectiva de la misión activa.

---

## 2. Paridad Bidireccional GUI <-> CLI en Tiempo Real

1. **Sincronización Inmediata sobre el Shadow State JSON**:
   - Cualquier mutación ejecutada por el candidato en una terminal CLI (por ejemplo, `systemctl restart httpd`, `nmcli con up eth0` o `config firewall policy` en FortiOS CLI) actualiza el árbol `InfrastructureState.shells` y se refleja instantáneamente en los applets gráficos correspondientes (Cockpit, Server Manager, FortiGate WebUI, vSphere Client).
   - Inversamente, cualquier acción realizada mediante un applet gráfico (`GUI_APPLET` o `CONTEXT_MENU`) emite internamente su equivalente operacional sobre el mismo contrato `InfrastructureState` y registra el evento en el colector de telemetría con idéntica trazabilidad forense.
2. **Propagación Transversal (`crossLayerAlerts`)**:
   - Una falla o remediación en la Capa L1 (Lenovo XClarity BMC) o Capa L2 (VMware vCenter ESXi 8) propaga sus efectos sobre la salud percibida en las Capas L3 (RHEL 8 / Windows Server 2019) y L4 (FortiGate 7.6.1) a través de `crossLayerAlerts` y las banderas de estado del contrato compartido.

---

## 3. Orquestación de Doble IA y Fast-Path Determinista

La resolución de comandos y acciones operativas sigue una jerarquía estricta de tres niveles para garantizar latencia ultrabaja, determinismo técnico y cero alucinaciones:

1. **Nivel 0 — Fast-Path Determinista Local (`FAST_PATH_LOCAL`, `< 5 ms`)**:
   - Los comandos de lectura e inspección frecuentes (`ls`, `pwd`, `whoami`, `cat`, `ip a`, `systemctl status`, `get system status`, `df -h`, `ps aux`) se resuelven de forma determinista directamente contra el `InfrastructureState` hidratado y los metadatos locales sin invocar modelos de lenguaje remotos.
2. **Nivel 1 — IA 1 Mecánica (`OLLAMA_MECHANICAL`, Ollama Local + SQLite/ChromaDB)**:
   - Responsable de la **hidratación selectiva** de escenarios, generación de salidas sintácticas extensas coherentes con el sistema de archivos virtual (`filesystem_metadata.db`) y **pre-calentamiento asíncrono al alcanzar el 50% de progreso** del reto actual para preparar el siguiente ticket de la cola (`missionQueue`) con latencia percibida cero.
3. **Nivel 2 — IA 2 Lógica (`GEMINI_LOGICAL`, Google Gemini vía `api-bff-gateway`)**:
   - Actúa exclusivamente como **Juez Lógico de Mutaciones Complejas y Evaluador de Causalidad de Infraestructura**.
   - **Rol Estricto Zero-Chatbot**: Gemini jamás conversa con el candidato, jamás ofrece pistas, tutoriales ni explicaciones conversacionales, y jamás rompe la ilusión del sistema operativo emulado. Su única salida permitida es la estructura estricta `CommandExecutionResponse` (con `stdout`, `stderr`, `exitCode`, `actionClassification`, `systemImpact` y `updatedState`).

---

## 4. Regla Anti-Spoiler y Segregación de Roles (`CANDIDATE_MODE`)

1. **Sanitización Obligatoria del Ticket de Misión**:
   - Cuando `InfrastructureState.roleMode === 'CANDIDATE_MODE'`, está terminantemente prohibido enviar al DOM, serializar en props de componentes visuales o exponer en consola las propiedades `expectedOptimalCommands` y `successCriteriaJsonPaths` de `ChallengeMissionTicket`.
   - Dichos campos existen únicamente para el motor de evaluación en el BFF y para la vista de auditoría/diseño en `RECRUITER_ARCHITECT_MODE`.
   - Siempre debe utilizarse el helper `sanitizeMissionTicketForRole()` de `@evaluati-on/shared-types` antes de proyectar un ticket en el espacio de trabajo del candidato.

---

## 5. Estándares de Ingeniería TypeScript y Gestión de Ventanas

1. **Cero Uso de `any` (`strict: true`, `noImplicitAny: true`, `strictNullChecks: true`)**:
   - Ningún archivo `.ts` o `.tsx` del monorepo puede utilizar el tipo `any`, `@ts-ignore` ni conversiones inseguras sin validación estructural.
2. **Gestión Centralizada de Ventanas Flotantes**:
   - Ninguna aplicación de escritorio o consola web puede implementar su propia lógica ad-hoc de `zIndex`, arrastre o maximización.
   - Toda ventana flotante (terminales SSH, visores de logs, editores de políticas, consolas KVM) debe administrarse exclusivamente mediante el paquete institucional `@evaluati-on/window-manager` y su hook `useWindowManagement`, garantizando que la ventana enfocada reciba `zIndex: 50` y las ventanas inactivas se reordenen limpiamente en el rango `10..49`.
3. **Telemetría Forense Obligatoria**:
   - Toda ejecución de comando o acción GUI debe registrarse mediante `TelemetryCollector` de `@evaluati-on/telemetry-sdk`, capturando cadencia de tipeo (`typingCadenceWpm`), detección de pegado (`clipboardPasteDetected`), clasificación de acción (`ActionClassification`) e impacto en el sistema (`SystemImpactLevel`).
