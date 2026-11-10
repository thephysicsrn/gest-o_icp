---
name: SESI ICP Design System
description: Sistema de design rigoroso, técnico e institucional para Iniciação Científica Pré-Universitária
colors:
  navy-primary: "#002B5C"
  navy-deep: "#001D3D"
  navy-subtle: "#003B71"
  green-accent: "#70B32D"
  green-forest: "#528521"
  green-light: "#86D636"
  blue-accent: "#005696"
  surface-base: "#F8FAFC"
  surface-white: "#FFFFFF"
  border-subtle: "#E2E8F0"
  border-mid: "#CBD5E1"
  text-primary: "#0F172A"
  text-secondary: "#475569"
  text-muted: "#64748B"
  text-subtle: "#94A3B8"
typography:
  display:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  heading:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  body-sm:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0em"
  caption:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.02em"
  micro-11:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.01em"
  micro-10:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "10px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.02em"
rounded:
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  2xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.navy-primary}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.navy-subtle}"
  button-accent:
    backgroundColor: "{colors.green-accent}"
    textColor: "{colors.navy-primary}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-accent-hover:
    backgroundColor: "{colors.green-light}"
---

# Design System — SESI ICP

## Overview
O sistema visual do **ICP (Iniciação Científica Pré-Universitária)** das Escolas SESI RN foi projetado para transmitir autoridade acadêmica, sobriedade editorial e rigor metodológico. Toda a experiência visual é orientada a estudantes pesquisadores, professores orientadores e coordenação regional, espelhando os parâmetros exigidos por bancas avaliadoras nacionais como FEBRACE e MOSTRATEC.

## Colors
A paleta central fundamenta-se nas cores institucionais do SESI aliadas a convenções estritas de contraste WCAG AA:
- **Azul SESI Navy (`#002B5C`):** Cor de autoridade principal, utilizada em barras de navegação, títulos de alto nível, botões primários e cabeçalhos de modais.
- **Azul Profundo (`#001D3D`) & Azul Médio (`#005696`):** Empregado em backgrounds com profundidade e destaques tipográficos sólidos.
- **Verde Acento (`#70B32D`):** Usado em pílulas, ícones de sucesso, badges e indicadores de estado ativo.
- **Verde Floresta Acessível (`#528521`):** Usado exclusivamente quando a cor verde precisa ser aplicada como texto sobre fundos claros, assegurando contraste superior a 4.5:1 (WCAG AA).
- **Superfícies Neutras (`#F8FAFC`, `#FFFFFF`):** Base limpa para foco na leitura e documentação de bancada.

## Typography
- **Títulos e Destaques Institucionais:** `Outfit` (sans-serif geométrica limpa com pesos 700 e 800) para cabeçalhos editoriais.
- **Leitura, Dados e Tabelas:** `Inter` (sans-serif técnica neutra) com escala de pesos claramente definidos (400 regular, 500 medium, 600 semibold, 700 bold).
- **Rótulos Técnicos & Identificadores:** Monospaced limpa para números de protocolos, identificadores de linhas e metadados de sessão.

## Layout
- **Grid Modular:** Estrutura responsiva fluida em 12 colunas em desktop, colapsando em 1 ou 2 colunas em tablets e smartphones.
- **Alvos de Toque:** Controles interativos em telas sensíveis ao toque possuem área mínima de 36×36px a 44×44px com espaçamento entre alvos para evitar toques acidentais em bancada.
- **Contenção:** Seções delimitadas com espaçamento vertical generoso (`space-y-16` a `space-y-24`), garantindo que o usuário processe uma dimensão metodológica por vez.

## Elevation & Depth
- **Sombras Físicas Naturais:** Sombras com dispersão suave (`shadow-xs`, `shadow-sm`, `shadow-md`), sem halos coloridos artificiais ou blocos pretos rígidos.
- **Bordas Perimetrais Delicadas:** Uso de `border-slate-200/80` com raio moderado (`rounded-2xl` a `rounded-3xl`), evitando contornos unilaterais artificiais.

## Shapes
- **Cards e Módulos:** Cantos arredondados contínuos (`rounded-2xl` e `rounded-3xl`).
- **Pílulas de Metadados:** Formas `rounded-full` para status de homologação, polos escolares e categorias temáticas.

## Components
- **Botões de Ação:** Estados bem demarcados (`hover`, `active:scale-95`, `disabled:opacity-50`, `focus-visible`).
- **Modais de Trabalho:** Diálogos acessíveis estruturados com `role="dialog"`, `aria-modal="true"` e rótulos semânticos para leitores de tela.
- **Showcase & Galeria:** Imagens reais com `loading="lazy"` e `decoding="async"`, preservando desempenho mesmo em redes móveis escolares.

## Do's and Don'ts
- **DO:** Usar o verde `#528521` para texto sobre fundo branco para garantir contraste WCAG AA.
- **DO:** Utilizar ícones SVG técnicos do Lucide com espessura uniforme.
- **DON'T:** Nunca usar texto com gradiente (`bg-clip-text bg-gradient`) em títulos.
- **DON'T:** Nunca usar animações de quique elástico (`animate-bounce`) em fluxos operacionais; preferir spinners ou transições suaves de opacidade.
- **DON'T:** Não usar bordas laterais espessas (`border-l-2`) isoladas em caixas de aviso; usar contorno perimetral sutil.
- **DON'T:** Evitar emojis informais ou lúdicos na interface.
