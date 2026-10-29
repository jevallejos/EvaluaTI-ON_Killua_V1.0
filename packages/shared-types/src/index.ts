/**
 * @evaluati-on/shared-types
 * Contrato Universal de Tipos, Shadow State JSON (InfrastructureState),
 * Tickets de Misión y Telemetría Forense para EvaluaTI-ON_Killua_V1.0.
 */

export type PlatformLayerId =
  | 'L1_XCLARITY_BMC'
  | 'L2_VCENTER_ESXI8'
  | 'L3_RHEL8_LINUX'
  | 'L3_WIN2019_SERVER'
  | 'L4_FORTIGATE_761';

export type WorkspaceRoleMode =
  | 'CANDIDATE_MODE'
  | 'RECRUITER_ARCHITECT_MODE';

export type ActionClassification =
  | 'DIAGNOSTIC'
  | 'CONFIGURATION'
  | 'DESTRUCTIVE'
  | 'INVALID_SYNTAX';

export type SystemImpactLevel =
  | 'NONE'
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL_OUTAGE';

export type ResolutionEngineSource =
  | 'FAST_PATH_LOCAL'
  | 'OLLAMA_MECHANICAL'
  | 'GEMINI_LOGICAL';

export type TelemetryInteractionSource =
  | 'CLI_TERMINAL'
  | 'GUI_APPLET'
  | 'CONTEXT_MENU';

export type LinuxViewMode =
  | 'GNOME_COCKPIT_GUI'
  | 'CLI_FULLSCREEN_ONLY';

/**
 * Ticket de misión que define un escenario de incidente técnico.
 * En CANDIDATE_MODE jamás deben exponerse expectedOptimalCommands ni successCriteriaJsonPaths.
 */
export interface ChallengeMissionTicket {
  challengeId: string;
  title: string;
  platformId: PlatformLayerId;
  linuxViewMode?: LinuxViewMode;
  incidentContextSummary: string;
  observableObjectives: string[];
  slaDurationSeconds: number;
  expectedOptimalCommands?: string[];
  successCriteriaJsonPaths?: string[];
}

/**
 * Evento individual de telemetría forense capturado en tiempo real.
 */
export interface TelemetryEvent {
  eventId: string;
  sessionId: string;
  candidateToken: string;
  timestampIso: string;
  platformId: PlatformLayerId;
  interactionSource: TelemetryInteractionSource;
  commandOrAction: string;
  exitCode: number;
  actionClassification: ActionClassification;
  systemImpact: SystemImpactLevel;
  latencyMs: number;
  typingCadenceWpm?: number;
  clipboardPasteDetected: boolean;
}

/**
 * Alerta transversal propagada entre capas de infraestructura (L1 -> L2 -> L3 -> L4).
 */
export interface CrossLayerAlert {
  alertId: string;
  sourceLayer: PlatformLayerId;
  affectedLayers: PlatformLayerId[];
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  code: string;
  message: string;
  timestampIso: string;
  acknowledged: boolean;
}

// ============================================================================
// CAPA L1: Lenovo XClarity Controller (BMC / Hardware Bare-Metal)
// ============================================================================

export interface XClarityThermalSensor {
  sensorId: string;
  location: 'CPU1_DIE' | 'CPU2_DIE' | 'INLET_AMBIENT' | 'EXHAUST_REAR' | 'PCH_CHIPSET' | 'NVME_BACKPLANE';
  temperatureCelsius: number;
  warningThresholdCelsius: number;
  criticalThresholdCelsius: number;
  status: 'OK' | 'WARNING' | 'CRITICAL';
}

export interface XClarityPowerSupplyUnit {
  psuSlot: 1 | 2;
  model: string;
  wattageCapacity: number;
  currentLoadWatts: number;
  inputVoltageAc: number;
  status: 'ONLINE' | 'REDUNDANCY_LOST' | 'FAULT' | 'DISCONNECTED';
}

export interface XClarityRaidPhysicalDrive {
  bayIndex: number;
  serialNumber: string;
  mediaType: 'NVME_SSD' | 'SAS_SSD' | 'SAS_HDD';
  capacityGb: number;
  raidArrayId: string;
  raidLevel: 'RAID_0' | 'RAID_1' | 'RAID_5' | 'RAID_10';
  state: 'ONLINE' | 'REBUILDING' | 'PREDICTIVE_FAILURE' | 'FAILED' | 'UNCONFIGURED_GOOD';
  smartHealthPct: number;
}

export interface XClarityBmcEventLogEntry {
  eventSequenceId: number;
  timestampIso: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  subsystem: 'SYSTEM_BOARD' | 'POWER' | 'COOLING' | 'STORAGE_RAID' | 'MEMORY_ECC' | 'FIRMWARE';
  eventCode: string;
  description: string;
}

export interface XClarityL1ShellState {
  hydrated: boolean;
  chassisModel: string;
  serialNumber: string;
  bmcFirmwareVersion: string;
  uefiVersion: string;
  hostPowerState: 'ON' | 'OFF' | 'CYCLE_PENDING' | 'HALTED_THERMAL';
  locatorLedActive: boolean;
  overallHealth: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  fanSpeedRpmPct: number;
  thermalSensors: XClarityThermalSensor[];
  powerSupplies: XClarityPowerSupplyUnit[];
  raidPhysicalDrives: XClarityRaidPhysicalDrive[];
  bmcEventLogs: XClarityBmcEventLogEntry[];
}

// ============================================================================
// CAPA L2: VMware vCenter Server & ESXi 8.0 Hypervisor Cluster
// ============================================================================

export interface VCenterEsxiHostNode {
  hostId: string;
  fqdn: string;
  esxiBuildVersion: string;
  connectionState: 'CONNECTED' | 'NOT_RESPONDING' | 'MAINTENANCE_MODE' | 'DISCONNECTED';
  cpuUsagePct: number;
  memoryUsagePct: number;
  totalMemoryGb: number;
  linkedBmcSerial?: string;
}

export interface VCenterDatastoreVolume {
  datastoreId: string;
  name: string;
  filesystemType: 'VMFS_6' | 'NFS_41' | 'VSAN_8';
  capacityTb: number;
  freeSpaceTb: number;
  latencyMs: number;
  status: 'ACCESSIBLE' | 'DEGRADED' | 'INACCESSIBLE' | 'READ_ONLY';
}

export interface VCenterVirtualMachine {
  vmId: string;
  name: string;
  guestOsId: 'RHEL_8_64' | 'WINDOWS_SERVER_2019' | 'FORTIGATE_VM64';
  hostId: string;
  datastoreId: string;
  powerState: 'POWERED_ON' | 'POWERED_OFF' | 'SUSPENDED';
  vCpuCount: number;
  memoryGb: number;
  vmwareToolsStatus: 'RUNNING_CURRENT' | 'RUNNING_OUTDATED' | 'NOT_RUNNING';
  portGroupName: string;
  ipAddress: string;
}

export interface VCenterDistributedSwitchPortGroup {
  portGroupId: string;
  name: string;
  vlanId: number;
  uplinkTeamingPolicy: 'LOADBALANCE_SRCID' | 'FAILOVER_EXPLICIT' | 'LACP_ACTIVE';
  activeUplinks: string[];
  standbyUplinks: string[];
  promiscuousMode: boolean;
}

export interface VCenterL2ShellState {
  hydrated: boolean;
  vcenterApplianceFqdn: string;
  vcenterVersion: string;
  clusterName: string;
  haEnabled: boolean;
  drsAutomationLevel: 'MANUAL' | 'PARTIALLY_AUTOMATED' | 'FULLY_AUTOMATED';
  esxiHosts: VCenterEsxiHostNode[];
  datastores: VCenterDatastoreVolume[];
  virtualMachines: VCenterVirtualMachine[];
  distributedPortGroups: VCenterDistributedSwitchPortGroup[];
}

// ============================================================================
// CAPA L3 (Linux): Red Hat Enterprise Linux 8 (RHEL 8 GUI Cockpit + Bash CLI)
// ============================================================================

export interface Rhel8SystemdUnitState {
  unitName: string;
  loadState: 'loaded' | 'not-found' | 'masked';
  activeState: 'active' | 'inactive' | 'failed' | 'activating';
  subState: 'running' | 'dead' | 'exited' | 'failed' | 'listening';
  enabledOnBoot: boolean;
  mainPid?: number;
  lastErrorLine?: string;
}

export interface Rhel8NetworkInterface {
  ifaceName: string;
  macAddress: string;
  ipv4Cidr: string;
  gatewayIpv4: string;
  dnsServers: string[];
  mtu: number;
  operState: 'UP' | 'DOWN' | 'UNKNOWN';
  nmcliConnectionProfile: string;
}

export interface Rhel8LvmVolumeState {
  devicePath: string;
  mountPoint: string;
  vgName: string;
  lvName: string;
  fsType: 'xfs' | 'ext4' | 'swap';
  sizeGb: number;
  usedPct: number;
  inodeUsedPct: number;
  readOnlyMount: boolean;
}

export interface Rhel8VirtualFileEntry {
  absolutePath: string;
  ownerUser: string;
  ownerGroup: string;
  octalPermissions: string;
  selinuxContext: string;
  content: string;
}

export interface Rhel8L3ShellState {
  hydrated: boolean;
  hostname: string;
  kernelRelease: string;
  selinuxMode: 'ENFORCING' | 'PERMISSIVE' | 'DISABLED';
  currentWorkingDirectory: string;
  activeUser: string;
  loadAverage: [number, number, number];
  memoryAvailableMb: number;
  memoryTotalMb: number;
  systemdUnits: Rhel8SystemdUnitState[];
  networkInterfaces: Rhel8NetworkInterface[];
  lvmVolumes: Rhel8LvmVolumeState[];
  firewalldActiveZones: Record<string, { ports: string[]; services: string[] }>;
  virtualFiles: Record<string, Rhel8VirtualFileEntry>;
  journalctlRecentEntries: string[];
}

// ============================================================================
// CAPA L3 (Windows): Windows Server 2019 (Server Manager GUI + PowerShell CLI)
// ============================================================================

export interface Win2019ServiceItem {
  serviceName: string;
  displayName: string;
  status: 'Running' | 'Stopped' | 'Paused' | 'StartPending';
  startType: 'Automatic' | 'Manual' | 'Disabled';
  serviceAccount: string;
}

export interface Win2019IisAppPoolState {
  poolName: string;
  state: 'Started' | 'Stopped';
  managedRuntimeVersion: 'v4.0' | 'No Managed Code';
  identityType: 'ApplicationPoolIdentity' | 'NetworkService' | 'SpecificUser';
  workerProcessPid?: number;
}

export interface Win2019EventLogRecord {
  eventId: number;
  logName: 'System' | 'Application' | 'Security' | 'Directory Service' | 'DNS Server';
  level: 'Information' | 'Warning' | 'Error' | 'Critical';
  source: string;
  timestampIso: string;
  message: string;
}

export interface Win2019NetworkAdapter {
  interfaceAlias: string;
  ipv4Address: string;
  subnetPrefixLength: number;
  defaultGateway: string;
  dnsClientServerAddresses: string[];
  linkStatus: 'Up' | 'Disconnected' | 'Disabled';
}

export interface Win2019L3ShellState {
  hydrated: boolean;
  computerName: string;
  domainName: string;
  osBuildVersion: string;
  currentPowerShellLocation: string;
  activeDirectoryDomainControllerHealthy: boolean;
  sysvolReplicationStatus: 'SYNCHRONIZED' | 'DFSR_BACKLOG' | 'JOURNAL_WRAP_ERROR';
  dnsServerForwardersHealthy: boolean;
  windowsServices: Win2019ServiceItem[];
  iisApplicationPools: Win2019IisAppPoolState[];
  networkAdapters: Win2019NetworkAdapter[];
  eventViewerLogs: Win2019EventLogRecord[];
  registryOverrides: Record<string, string>;
}

// ============================================================================
// CAPA L4: FortiGate 7.6.1 Next-Generation Firewall (FortiOS WebUI + CLI)
// ============================================================================

export interface FortiGateInterfaceItem {
  name: string;
  alias: string;
  vdom: string;
  ipCidr: string;
  allowAccess: Array<'ping' | 'https' | 'ssh' | 'snmp' | 'fgfm'>;
  status: 'up' | 'down';
  zoneName?: string;
}

export interface FortiGateFirewallPolicy {
  policyId: number;
  name: string;
  srcIntf: string[];
  dstIntf: string[];
  srcAddr: string[];
  dstAddr: string[];
  service: string[];
  action: 'accept' | 'deny';
  natEnabled: boolean;
  utmInspectionProfile?: string;
  enabled: boolean;
  hitCount: number;
}

export interface FortiGateIpsecTunnelState {
  tunnelName: string;
  remoteGatewayIp: string;
  boundInterface: string;
  phase1Status: 'UP' | 'DOWN' | 'NEGOTIATING';
  phase2SelectorsUp: number;
  phase2SelectorsTotal: number;
  rxBytes: number;
  txBytes: number;
}

export interface FortiGateSdWanSlaHealth {
  healthCheckName: string;
  memberInterface: string;
  targetServer: string;
  latencyMs: number;
  jitterMs: number;
  packetLossPct: number;
  slaMet: boolean;
}

export interface FortiGateStaticRoute {
  seqNum: number;
  dstSubnetCidr: string;
  gatewayIp: string;
  device: string;
  administrativeDistance: number;
  priority: number;
}

export interface FortiGateL4ShellState {
  hydrated: boolean;
  hostname: string;
  serialNumber: string;
  fortiOsVersion: string;
  activeVdom: string;
  cpuUsagePct: number;
  memoryUsagePct: number;
  sessionCountActive: number;
  fortiGuardConnected: boolean;
  interfaces: FortiGateInterfaceItem[];
  firewallPolicies: FortiGateFirewallPolicy[];
  ipsecTunnels: FortiGateIpsecTunnelState[];
  sdWanHealthChecks: FortiGateSdWanSlaHealth[];
  staticRoutes: FortiGateStaticRoute[];
}

// ============================================================================
// SHADOW STATE JSON PRINCIPAL: InfrastructureState
// ============================================================================

export interface InfrastructureShellsBundle {
  xclarityL1: XClarityL1ShellState;
  vcenterL2: VCenterL2ShellState;
  rhel8L3: Rhel8L3ShellState;
  win2019L3: Win2019L3ShellState;
  fortigateL4: FortiGateL4ShellState;
}

export interface InfrastructureState {
  sessionId: string;
  activePlatform: PlatformLayerId;
  roleMode: WorkspaceRoleMode;
  missionQueue: ChallengeMissionTicket[];
  currentMissionIndex: number;
  crossLayerAlerts: CrossLayerAlert[];
  shells: InfrastructureShellsBundle;
}

/**
 * Respuesta estandarizada tras ejecutar un comando CLI o acción GUI
 * a través del Fast-Path local, IA 1 Mecánica (Ollama) o IA 2 Lógica (Gemini).
 */
export interface CommandExecutionResponse {
  commandRaw: string;
  stdout: string;
  stderr: string;
  exitCode: number;
  resolvedBy: ResolutionEngineSource;
  latencyMs: number;
  actionClassification: ActionClassification;
  systemImpact: SystemImpactLevel;
  updatedState: InfrastructureState;
  checkpointReached?: string;
  challengeCompleted: boolean;
}

/**
 * Constante oficial de Cascarón Vacío Reactivo para inicialización e hidratación limpia.
 * Cero datos operativos hardcodeados.
 */
export const INITIAL_EMPTY_INFRASTRUCTURE_STATE: InfrastructureState = {
  sessionId: 'UNINITIALIZED_SESSION',
  activePlatform: 'L3_RHEL8_LINUX',
  roleMode: 'CANDIDATE_MODE',
  missionQueue: [],
  currentMissionIndex: 0,
  crossLayerAlerts: [],
  shells: {
    xclarityL1: {
      hydrated: false,
      chassisModel: '',
      serialNumber: '',
      bmcFirmwareVersion: '',
      uefiVersion: '',
      hostPowerState: 'OFF',
      locatorLedActive: false,
      overallHealth: 'HEALTHY',
      fanSpeedRpmPct: 0,
      thermalSensors: [],
      powerSupplies: [],
      raidPhysicalDrives: [],
      bmcEventLogs: [],
    },
    vcenterL2: {
      hydrated: false,
      vcenterApplianceFqdn: '',
      vcenterVersion: '',
      clusterName: '',
      haEnabled: false,
      drsAutomationLevel: 'MANUAL',
      esxiHosts: [],
      datastores: [],
      virtualMachines: [],
      distributedPortGroups: [],
    },
    rhel8L3: {
      hydrated: false,
      hostname: '',
      kernelRelease: '',
      selinuxMode: 'ENFORCING',
      currentWorkingDirectory: '/',
      activeUser: 'root',
      loadAverage: [0, 0, 0],
      memoryAvailableMb: 0,
      memoryTotalMb: 0,
      systemdUnits: [],
      networkInterfaces: [],
      lvmVolumes: [],
      firewalldActiveZones: {},
      virtualFiles: {},
      journalctlRecentEntries: [],
    },
    win2019L3: {
      hydrated: false,
      computerName: '',
      domainName: '',
      osBuildVersion: '',
      currentPowerShellLocation: 'C:\\Users\\Administrator',
      activeDirectoryDomainControllerHealthy: false,
      sysvolReplicationStatus: 'SYNCHRONIZED',
      dnsServerForwardersHealthy: false,
      windowsServices: [],
      iisApplicationPools: [],
      networkAdapters: [],
      eventViewerLogs: [],
      registryOverrides: {},
    },
    fortigateL4: {
      hydrated: false,
      hostname: '',
      serialNumber: '',
      fortiOsVersion: '',
      activeVdom: 'root',
      cpuUsagePct: 0,
      memoryUsagePct: 0,
      sessionCountActive: 0,
      fortiGuardConnected: false,
      interfaces: [],
      firewallPolicies: [],
      ipsecTunnels: [],
      sdWanHealthChecks: [],
      staticRoutes: [],
    },
  },
};

/**
 * Sanitiza un ChallengeMissionTicket según el rol activo (Regla Anti-Spoiler).
 * En CANDIDATE_MODE elimina expectedOptimalCommands y successCriteriaJsonPaths.
 */
export function sanitizeMissionTicketForRole(
  ticket: ChallengeMissionTicket,
  roleMode: WorkspaceRoleMode
): ChallengeMissionTicket {
  if (roleMode === 'RECRUITER_ARCHITECT_MODE') {
    return {
      ...ticket,
      observableObjectives: [...ticket.observableObjectives],
    };
  }
  return {
    challengeId: ticket.challengeId,
    title: ticket.title,
    platformId: ticket.platformId,
    ...(ticket.linuxViewMode !== undefined ? { linuxViewMode: ticket.linuxViewMode } : {}),
    incidentContextSummary: ticket.incidentContextSummary,
    observableObjectives: [...ticket.observableObjectives],
    slaDurationSeconds: ticket.slaDurationSeconds,
  };
}
