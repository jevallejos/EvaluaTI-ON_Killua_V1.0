import type { CSSProperties, FC } from 'react';

/**
 * Tokens oficiales de color de la identidad corporativa EvaluaTI-ON_Killua_V1.0.
 */
export const BRAND_COLOR_TOKENS = {
  DEEP_NAVY: '#0B132B',
  CYBER_CYAN: '#00A8E8',
  POWER_ORANGE: '#FF6B00',
  TERMINAL_WHITE: '#F8FAFC',
} as const;

export type BrandColorTokenKey = keyof typeof BRAND_COLOR_TOKENS;

export type EvaluationBrandLogoVariant = 'full' | 'isotipo' | 'terminal';

export interface EvaluationBrandLogoProps {
  variant?: EvaluationBrandLogoVariant;
  height?: number;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
}

/**
 * Componente SVG Reactivo Oficial <EvaluationBrandLogo />
 * Renderiza el imagotipo del Cerebro de Circuitos con check cian (#00A8E8),
 * tipografía institucional EvaluaTI-ON y el símbolo de encendido en ON (#FF6B00).
 */
export const EvaluationBrandLogo: FC<EvaluationBrandLogoProps> = ({
  variant = 'full',
  height = 48,
  className,
  style,
  ariaLabel = 'EvaluaTI-ON Official Brand Logo',
}) => {
  const { DEEP_NAVY, CYBER_CYAN, POWER_ORANGE, TERMINAL_WHITE } = BRAND_COLOR_TOKENS;

  if (variant === 'isotipo') {
    return (
      <svg
        width={height}
        height={height}
        viewBox="0 0 96 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={ariaLabel}
        className={className}
        style={style}
      >
        <rect width="96" height="96" rx="20" fill={DEEP_NAVY} />
        {/* Hemisferio de circuitos (Cerebro Tecnológico) */}
        <path
          d="M32 24C21 24 14 32 14 42C14 47 16 51 20 54C18 58 18 64 23 69C28 74 36 74 42 72V24H32Z"
          stroke={CYBER_CYAN}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M64 24C75 24 82 32 82 42C82 47 80 51 76 54C78 58 78 64 73 69C68 74 60 74 54 72V24H64Z"
          stroke={CYBER_CYAN}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Trazas y nodos de circuito */}
        <path d="M22 40H34L38 44" stroke={CYBER_CYAN} strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="22" cy="40" r="3" fill={CYBER_CYAN} />
        <path d="M26 56H36" stroke={CYBER_CYAN} strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="26" cy="56" r="3" fill={POWER_ORANGE} />
        <path d="M74 40H62L58 44" stroke={CYBER_CYAN} strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="74" cy="40" r="3" fill={CYBER_CYAN} />
        {/* Check Cian Central de Validación Técnica */}
        <path
          d="M35 50L45 60L65 36"
          stroke={CYBER_CYAN}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Indicador de Encendido Naranja */}
        <circle cx="48" cy="16" r="4" fill={POWER_ORANGE} />
      </svg>
    );
  }

  if (variant === 'terminal') {
    const width = Math.round(height * 3.8);
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 304 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={ariaLabel}
        className={className}
        style={style}
      >
        <rect width="304" height="80" rx="12" fill={DEEP_NAVY} stroke={CYBER_CYAN} strokeWidth="2" />
        {/* Prompt CLI [root@killua]# */}
        <path
          d="M22 28L36 40L22 52"
          stroke={POWER_ORANGE}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="42"
          y1="52"
          x2="58"
          y2="52"
          stroke={CYBER_CYAN}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <text
          x="72"
          y="48"
          fontFamily="monospace"
          fontWeight="700"
          fontSize="24"
          fill={TERMINAL_WHITE}
        >
          Evalua
          <tspan fill={CYBER_CYAN}>TI</tspan>
          <tspan fill={TERMINAL_WHITE}>-</tspan>
          <tspan fill={POWER_ORANGE}>ON</tspan>
        </text>
      </svg>
    );
  }

  const fullWidth = Math.round(height * 4.5);
  return (
    <svg
      width={fullWidth}
      height={height}
      viewBox="0 0 432 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
      className={className}
      style={style}
    >
      <rect width="432" height="96" rx="18" fill={DEEP_NAVY} />
      {/* Isotipo Cerebro de Circuitos + Check Cian */}
      <g transform="translate(8, 0)">
        <path
          d="M32 22C21 22 14 30 14 40C14 45 16 49 20 52C18 56 18 62 23 67C28 72 36 72 42 70V22H32Z"
          stroke={CYBER_CYAN}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M62 22C73 22 80 30 80 40C80 45 78 49 74 52C76 56 76 62 71 67C66 72 58 72 52 70V22H62Z"
          stroke={CYBER_CYAN}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="24" cy="38" r="2.8" fill={CYBER_CYAN} />
        <circle cx="70" cy="38" r="2.8" fill={CYBER_CYAN} />
        <circle cx="26" cy="56" r="2.8" fill={POWER_ORANGE} />
        <path
          d="M33 48L43 58L63 34"
          stroke={CYBER_CYAN}
          strokeWidth="4.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Logotipo Tipográfico EvaluaTI-ON */}
      <text
        x="104"
        y="60"
        fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
        fontWeight="800"
        fontSize="36"
        letterSpacing="0.5"
        fill={TERMINAL_WHITE}
      >
        Evalua
        <tspan fill={CYBER_CYAN}>TI</tspan>
        <tspan fill={TERMINAL_WHITE}>-</tspan>
      </text>

      {/* Botón de Encendido Integrado en ON */}
      <g transform="translate(312, 26)">
        <circle
          cx="22"
          cy="22"
          r="16"
          stroke={POWER_ORANGE}
          strokeWidth="4.5"
          strokeDasharray="78 22"
          strokeDashoffset="-12"
          strokeLinecap="round"
        />
        <line
          x1="22"
          y1="4"
          x2="22"
          y2="18"
          stroke={POWER_ORANGE}
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <text
          x="46"
          y="34"
          fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
          fontWeight="800"
          fontSize="36"
          fill={POWER_ORANGE}
        >
          N
        </text>
      </g>
    </svg>
  );
};
