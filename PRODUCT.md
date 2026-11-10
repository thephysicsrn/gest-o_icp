# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Alunos Pesquisadores (Bolsistas):** Estudantes do Ensino Médio das unidades escolares do SESI RN (São Gonçalo do Amarante, Macau e Mossoró). Registram ensaios práticos, dados experimentais, fotos de bancada e redigem o diário de bordo com rigor metodológico.
- **Professores Orientadores:** Docentes e líderes de grupos temáticos de pesquisa escolar. Conduzem mentoria semanal, revisam e homologam registros do diário de bordo, gerenciam tarefas, frequência e disponibilizam materiais acadêmicos.
- **Coordenação Regional (Administrador):** Gestores da rede SESI RN que acompanham o andamento dos polos científicos, coordenam transferências entre linhas e grupos, auditam o cumprimento das metas acadêmicas e gerenciam as credenciais de acesso.

## Product Purpose

Substituir anotações dispersas, cadernos físicos ou documentos avulsos por uma infraestrutura digital auditável e metodológica. O sistema formaliza todo o ciclo da Iniciação Científica Pré-Universitária (ICP), desde a definição da pergunta e hipótese até a homologação final para bancas da FEBRACE e MOSTRATEC.

## Positioning

A plataforma oficial de Iniciação Científica Pré-Universitária da Rede SESI Escola RN. Diferencia-se de sistemas de gestão escolar convencionais por implementar regras estritas de metodologia científica: hierarquia de linhas de investigação, diário de bordo em tempo real com fotos comprobatórias, mentoria 1:1 com pareceres acadêmicos formais e exportação em PDF homologada.

## Operating Context

- Bancadas de laboratórios de ciências, química, robótica e biotecnologia das unidades SESI RN.
- Acesso tanto em computadores institucionais de bancada quanto em dispositivos móveis no momento dos testes práticos.
- Reuniões semanais presenciais e híbridas de orientação acadêmica.
- Preparação para mostras científicas estaduais, nacionais (FEBRACE, MOSTRATEC) e feiras de inovação.

## Capabilities and Constraints

- **Controle de Acesso RBAC:** 3 perfis definidos (`student`, `teacher`, `admin`) integrados ao Firebase Auth.
- **Hierarquia Acadêmica:** Grupos liderados por professores orientadores, cada um comportando até 5 linhas temáticas, com limite de até 3 estudantes por linha para assegurar protagonismo real.
- **Diário de Bordo Oficial:** Módulo de redação científica com categorização de parâmetros, upload de evidências fotográficas e histórico de versões.
- **Ciclo de Homologação:** Pareceres formais semanais (aprovado, ajustes requeridos) emitidos pelos orientadores.
- **Sala Privada de Documentos:** Repositório seguro para artigos acadêmicos, referências SciELO/CAPES e diretrizes laboratoriais.
- **Exportação Institucional:** Geração de relatórios completos em formato PDF prontos para submissão a comitês científicos.
- **Notificações:** Disparos automáticos de credenciais via EmailJS e modelos estruturados para comunicação direta com bolsistas.

## Brand Commitments

- **Identidade SESI RN:** Cores institucionais sólidas (Azul SESI `#002B5C`, Verde Destaque `#70B32D`).
- **Linguagem Visual:** Rigorosa, técnica, limpa e editorial. Sem elementos lúdicos infantis, sem emojis ou clichês informais.
- **Tipografia:** Família `Inter` para clareza e precisão em dados, tabelas e diários; `Outfit` para títulos e identificação de marca institucional.
- **Iconografia:** Lucide Icons técnicos, aplicados com propósito funcional claro.

## Evidence on Hand

- Logotipo institucional oficial: `/sesi-escola-logo.png`.
- Registros fotográficos de ensaios laboratoriais reais de estudantes do SESI RN: `/alunos-laboratorio-1.jpg`, `/alunos-laboratorio-2.jpg`.
- Estrutura completa de componentes modulares em `src/components/`.

## Product Principles

1. **Rigor e Falseabilidade:** O sistema valoriza o método científico e o registro honesto de parâmetros e hipóteses, incluindo hipóteses refutadas.
2. **Autoria Incontestável:** Cada medição, anotação e foto possui data, autoria individual e chancela do orientador.
3. **Clareza Sem Fricção:** A interface prioriza foco, leitura limpa e formulários diretos para não sobrecarregar estudantes nem orientadores na bancada.
4. **Prontidão para Feiras Nacionais:** Toda a estrutura de dados é desenhada para atender imediatamente aos critérios de avaliação da FEBRACE e MOSTRATEC.
