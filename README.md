# EvaluaTI-ON_Killua_V1.0

**Plataforma Institucional de Evaluación Forense de Infraestructura Crítica TI**  
*Cascarones Vacíos Reactivos (`L1..L4`) + Orquestación Híbrida de Doble IA (Ollama Local + Google Gemini) + Telemetría Forense Time-Machine*

---

## Arquitectura del Monorepo (Hito M0)

```text
EvaluaTI-ON_Killua/
├── .agents/
│   ├── mcp_config.example.json
│   └── skills/
│       └── evaluati-on-killua-architect/
│           └── SKILL.md
├── apps/
│   ├── corporate-portal-app/
│   ├── mutant-workspace-host/
│   ├── executive-scorecard-app/
│   ├── xclarity-app/            # L1: Lenovo XClarity BMC
│   ├── vcenter-server-app/      # L2: VMware vCenter & ESXi 8
│   ├── rhel-8-gui-app/          # L3: Red Hat Enterprise Linux 8 (Cockpit + Bash)
│   ├── windows-server-app/      # L3: Windows Server 2019 (Server Manager + PowerShell)
│   └── fortigate-app/           # L4: FortiGate 7.6.1 (FortiOS WebUI + CLI)
├── packages/
│   ├── shared-types/            # @evaluati-on/shared-types
│   ├── window-manager/          # @evaluati-on/window-manager
│   ├── telemetry-sdk/           # @evaluati-on/telemetry-sdk
│   └── brand-ui/                # @evaluati-on/brand-ui
├── services/
│   ├── api-bff-gateway/         # Orquestador BFF + Juez Lógico Gemini (Zero-Chatbot)
│   └── ai-mechanical-ingestor/  # Hidratador Mecánico Ollama + Pre-warming al 50%
├── databases/
│   ├── schemas/
│   ├── seeds/
│   └── rag-knowledge-base/
└── docs/
    ├── 01-product-and-business/
    ├── 02-architecture-and-adrs/
    │   ├── SAD_Killua_V1.md
    │   └── adr/
    │       └── ADR_001_to_006.md
    ├── 03-ai-governance-and-compliance/
    ├── 04-api-and-data-contracts/
    │   └── State_And_Telemetry_Contracts.md
    ├── 05-security-and-anti-cheat/
    └── 06-sre-and-operations/
```

---

## Paquetes Fundacionales (`packages/*`)

| Paquete | Descripción |
| :--- | :--- |
| `@evaluati-on/shared-types` | Contrato universal `InfrastructureState`, capas `L1..L4`, `CommandExecutionResponse`, `TelemetryEvent`, `ChallengeMissionTicket` y `INITIAL_EMPTY_INFRASTRUCTURE_STATE`. |
| `@evaluati-on/window-manager` | Hook `useWindowManagement` y rebalanceador determinista `zIndex` (`50` ventana activa, `10..49` ventanas inactivas). |
| `@evaluati-on/telemetry-sdk` | `TelemetryCollector` y `useTelemetryCollector` con medición automática de `typingCadenceWpm`, detección de pegado, métricas ejecutivas y fotogramas del *Time-Machine Forense*. |
| `@evaluati-on/brand-ui` | Tokens oficiales de color (`#0B132B`, `#00A8E8`, `#FF6B00`, `#F8FAFC`) y componente SVG `<EvaluationBrandLogo />` (`full`, `isotipo`, `terminal`). |

---

## Comandos Principales

```bash
# Instalar dependencias del monorepo
npm install

# Ejecutar verificación estricta de tipos TypeScript en todos los paquetes
npm run typecheck

# Compilar paquetes del monorepo
npm run build
```

---

## Vinculación con el Repositorio Remoto

```bash
git init
git remote add origin https://github.com/jevallejos/EvaluaTI-ON_Killua_V1.0.git
git branch -M main
git add .
git commit -m "feat(m0): initialize EvaluaTI-ON_Killua_V1.0 institutional monorepo foundation"
git push -u origin main
```
