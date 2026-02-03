# Project Brief: Visualizador de Finanças

---

## Executive Summary

**Visualizador de Finanças** é uma aplicação web que transforma extratos bancários em CSV em visualizações gráficas automáticas e bonitas. O produto resolve a dor de pessoas físicas que precisam organizar e visualizar suas finanças pessoais sem a complexidade de planilhas manuais ou apps financeiros cheios de recursos que não usam.

**Conceito Central:** Upload de CSV → Gráficos automáticos → Finanças bonitas

**Proposta de Valor:**
- ✅ Simples: upload de CSV, sem configuração complexa
- ✅ Bonito: visualizações profissionais e impactantes
- ✅ Gratuito: open-source, sem custos ocultos
- ✅ Inteligente: categorização automática via IA

---

## Problem Statement

### O Problema Atual

Pessoas físicas brasileiras enfrentam múltiplos desafios ao gerenciar suas finanças pessoais:

1. **Visualização Ruim:** Planilhas são feias, difíceis de manter e exigem conhecimento técnico
2. **Falta de Visibilidade:** "Não sei para onde meu dinheiro está indo" - transações ficam perdidas em extratos bancários
3. **Trabalho Manual:** Organizar dados manualmente em planilhas é demorado e propenso a erros

### Impacto Quantificado

- **77% dos brasileiros** não fazem controle financeiro regular (Fonte: Serasa)
- **63%** vivem sem saber exatamente quanto gastam por categoria
- Extratos bancários (Nubank, Inter, etc.) são fáceis de exportar mas difíceis de visualizar

### Soluções Existentes e Suas Limitações

| Solução | Limitação |
|---------|-----------|
| **Planilhas Excel/Sheets** | Feias, trabalho manual, requer conhecimento técnico |
| **GuiaBolso** | Interface poluída, muitos recursos, nem todos os bancos |
| **Mobills** | App pesado, recursos que muitos não usam, paywall |
| **Financeiras tradicionais** | Exigem sincronização bancária (privacidade), complexas |

### Por Que Agora?

- **Crescimento de bancos digitais:** Mais pessoas exportando extratos CSV
- **Cultura open-source:** Brasil adotando cada vez mais soluções livres
- **Privacidade em debate:** People want control over their financial data

---

## Proposed Solution

### Conceito Central

Uma aplicação web **simples e bonita** onde o usuário:
1. Exporta extrato bancário em CSV (Nubank, Inter, etc.)
2. Faz upload na plataforma
3. Recebe gráficos automáticos e impactantes instantaneamente

### Abordagem Diferenciada

**Vs. Planilhas:**
- Zero configuração de fórmulas ou formatação
- Visualizações profissionais automaticamente
- Categorização inteligente via IA

**Vs. Apps Financeiros (GuiaBolso/Mobills):**
- Foco em visualização, não em gestão completa
- Interface minimalista e bonita
- Open-source e gratuito
- Sem sync bancário (privacidade controlada pelo usuário)

**Vs. Outras soluções:**
- Gráficos bonitos para **compartilhar** nas redes
- Foco em estética + simplicidade

### Por Que Vai Funcionar

1. **Simplicidade extrema:** Upload e pronto - cadastro opcional
2. **Visual impactante:** Gráficos que as pessoas querem compartilhar
3. **Gratuito & Open-source:** Comunidade pode contribuir e customizar
4. **IA inteligente:** Categorização automática sem trabalho manual

---

## Target Users

### Primary User Segment: Brasileiros com Conta em Banco Digital

**Perfil Demográfico:**
- Idade: 25-45 anos
- Classe: A/B/C
- Educação: ensino superior completo
- Localização: urbana

**Comportamentos Atuais:**
- Usa banco digital (Nubank, Inter, NuBank, Banco do Brasil, etc.)
- Já exportou extrato CSV alguma vez
- Tenta controlar gastos mas desiste por falta de motivação visual
- Usa Instagram/TikTok - se preocupa com estética

**Necessidades Específicas:**
- "Quero ver para onde meu dinheiro vai de forma bonita"
- "Quero compartilhar meus gráficos com amigos/mídia social"
- "Não quero app complexo com mil recursos que não uso"
- "Quero algo gratuito que funcione bem"

**Metas:**
- Visibilidade clara de gastos por categoria
- Entendimento de fluxo de caixa mensal
- Motivação visual para continuar controlando finanças

### Secondary User Segment: Freelancers e Pequenos Empreendedores

**Perfil:**
- Freelancers que misturam finanças pessoais e profissionais
- Precisam de visualização rápida mas não têm orçamento para sistemas complexos

---

## Goals & Success Metrics

### Business Objectives

- **1,000 usuários ativos mensais (MAU)** nos primeiros 3 meses
- **50 uploads de CSV** por dia no primeiro mês
- **20% de usuários retornando** (retention day 30)
- **100 estrelas no GitHub** nos primeiros 2 meses

### User Success Metrics

- **< 30 segundos** do upload ao primeiro gráfico
- **< 2 cliques** para ver qualquer visualização
- **95% de uploads bem-sucedidos** (formato CSV aceito)
- **80% de satisfação** em feedback inicial

### Key Performance Indicators (KPIs)

| KPI | Definição | Target |
|-----|-----------|--------|
| **Upload Success Rate** | % de uploads processados sem erro | ≥ 95% |
| **Time to First Chart** | Tempo do upload ao primeiro gráfico visível | < 30s |
| **Category Match Rate** | % de transações categorizadas automaticamente | ≥ 80% |
| **Export Rate** | % de sessões onde usuário exporta gráfico | ≥ 30% |
| **Share Rate** | % de sessões onde usuário gera link compartilhável | ≥ 15% |

---

## MVP Scope

### Core Features (Must Have)

- **Upload de CSV:** Arrastar e soltar, aceita formatos dos principais bancos
- **Categorização Automática (IA):** Detecta "Uber Eats" → Alimentação, etc.
- **4 Gráficos Principais:**
  - 📊 **Categorias:** Pizza/barra mostrando distribuição de gastos
  - 📈 **Fluxo de Caixa:** Receitas vs Despesas por mês
  - 📉 **Tendências:** Comparação mês a mês
  - 💰 **Saldo Acumulado:** Evolução do saldo ao longo do tempo
- **Exportar Gráficos:** PNG/PDF para compartilhar
- **Filtros Avançados:** Por período, valor mínimo/máximo, busca por texto
- **Gerar Link Compartilhável:** Dashboard temporário para enviar a amigos

### Out of Scope for MVP

- ❌ Criação de conta/login (opcional no MVP)
- ❌ Edição manual de categorias (v2)
- ❌ Múltiplos CSVs em uma sessão (v2)
- ❌ Histórico de uploads (v2)
- ❌ Metas e orçamentos (v2)
- ❌ Notificações ou alertas (v3)
- ❌ Sincronização bancária automática (nunca - privacidade)

### MVP Success Criteria

**O MVP é considerado sucesso quando:**
1. Usuário consegue fazer upload de CSV Nubank/Inter e ver 4 gráficos em < 60 segundos
2. Pelo menos 70% das transações são categorizadas corretamente pela IA
3. Usuário consegue exportar pelo menos um gráfico sem erros
4. Pelo menos 10 usuários beta reportam satisfação ≥ 4/5

---

## Post-MVP Vision

### Phase 2 Features

- **Edição de Categorias:** Usuário pode corrigir categorização automática
- **Múltiplos CSVs:** Combinar extratos de diferentes bancos
- **Criação de Conta:** Salvar histórico, preferências
- **Temas Personalizados:** Escolher cores e layouts de gráficos
- **Comparação Períodos:** "Janeiro vs Fevereiro" lado a lado
- **Detecção de Anomalias:** Alertas de gastos suspeitos

### Long-Term Vision (1-2 anos)

- **Comunidade Ativa:** Contribuições open-source para novos formatos de CSV
- **Versão Mobile:** Progressive Web App (PWA)
- **API Pública:** Para desenvolvedores integrarem em seus projetos
- **Insights de IA:** "Você gastou 20% a mais este mês em alimentação"
- **Versão Pro:** Para contadores/consultores (múltiplos clientes)

### Expansion Opportunities

- **Pequenos Negócios:** Versão B2B para microempresas
- **Educação Financeira:** Conteúdo educativo integrado
- **Marketplace:** Templates de dashboards da comunidade
- **Integrações:** Plugin para Notion, Google Sheets, etc.

---

## Technical Considerations

### Platform Requirements

- **Target Platforms:** Web app (browser)
- **Browser Support:** Chrome, Firefox, Safari, Edge (últimas 2 versões)
- **Mobile:** Responsivo, funciona em mobile browsers
- **Performance:**
  - Upload de até 10MB CSV (~50k transações)
  - Renderização de gráficos em < 5 segundos
  - Categorização de 1k transações em < 10 segundos

### Technology Preferences

- **Frontend:** React + Vite (performance DX), TypeScript
- **Visualização:** Recharts / Chart.js / D3.js
- **Categorização IA:**
  - Início: regras base + embeddings de texto
  - Futuro: Fine-tuning de modelo NLP
- **Backend:** Node.js + Express (ou serverless functions)
- **Database:** PostgreSQL (Vercel Postgres / Supabase)
- **File Storage:** Vercel Blob / AWS S3
- **Hosting/Infrastructure:** Vercel (frontend), Railway (backend)

### Architecture Considerations

**Repository Structure:**
- Monorepo com frontend e backend separados
- `packages/web` - React app
- `packages/api` - Node.js API
- `packages/ai` - Categorização logic

**Service Architecture:**
- **API Gateway:** Upload endpoint, processamento assíncrono
- **Worker Service:** Processa CSV, aplica IA, gera insights
- **CDN:** Cache de gráficos gerados
- **Auth:** Supabase Auth (opcional MVP)

**Integration Requirements:**
- Parsing CSV: PapaParse
- IA/Categorização: OpenAI API / HuggingFace
- Gráficos: Recharts

**Security/Compliance:**
- Dados sensíveis criptografados em rest
- CSV deletado após 24h (política de retenção)
- Logs não registram conteúdo das transações
- LGPD compliant para dados brasileiros

---

## Constraints & Assumptions

### Constraints

- **Budget:** Bootstrapping - custos de infraestrutura < R$500/mês
- **Timeline:** MVP em 6-8 semanas (desenvolvedor solo ou time pequeno)
- **Resources:** 1 desenvolvedor full-time + 1 designer part-time
- **Technical:**
  - Sem sincronização bancária (complexidade regulatória)
  - IA deve funcionar offline ou com API barata
  - Deve ser responsivo (mobile-first)

### Key Assumptions

- Usuários sabem exportar CSV do banco
- Formato CSV dos bancos brasileiros é relativamente padronizado
- IA pode categorizar pelo menos 70% das transações corretamente
- Visualização bonita é diferencial suficiente vs apps completos
- Open-source atrairá contribuidores e early adopters
- Usuários estão dispostos a fazer upload manual de CSVs mensalmente

---

## Risks & Open Questions

### Key Risks

- **Risco 1: Adesão ao Upload Manual**
  - **Descrição:** Usuários podem preguiçar de exportar CSV todo mês
  - **Impacto:** Alto - afeta retenção diretamente
  - **Mitigação:** Upload mais simples que possível, reminder por email, extensoes de browser

- **Risco 2: Qualidade da Categorização**
  - **Descrição:** IA pode categorizar errado, frustrando usuários
  - **Impacto:** Alto - afeta confiança no produto
  - **Mitigação:** Testar com milhares de transações reais, permitir feedback, aprendizado contínuo

- **Risco 3: Formatos de CSV Incompatíveis**
  - **Descrição:** Cada banco tem formato diferente
  - **Impacto:** Médio - pode impedir usuários de alguns bancos
  - **Mitigação:** Começar com Nubank/Inter (maiores), criar normalização flexível, comunidade contribui

- **Risco 4: Privacidade vs Nuvem**
  - **Descrição:** Usuários podem não confiar upload de dados financeiros
  - **Impacto:** Alto - barreira de entrada
  - **Mitigação:** Transparência sobre retenção (24h), LGPD compliance, opção client-side (v2)

### Open Questions

- Qual é a fonte exata dos dados de treinamento da IA de categorização?
- Devemos suportar múltiplos CSVs desde o início ou v2?
- Qual é o modelo de monetização (se houver) além de open-source?
- Devemos permitir edição manual de categorias no MVP ou isso aumenta muito escopo?

### Areas Needing Further Research

- **Formatos de CSV:** Mapear formato exato de Nubank, Inter, Itaú, Bradesco, Banco do Brasil
- **Soluções similares:** Existe algo open-source já fazendo isso?
- **Validação IA:** Testar categorização com transações reais antes do MVP
- **Privacidade:** Estudar profundamente requisitos LGPD para dados financeiros

---

## Appendices

### A. Research Summary

**Nota:** Pesquisa de mercado e análise competitiva detalhada serão realizadas no próximo passo com @analyst antes de avançar para PRD.

**Descobertas Iniciais:**
- Soluções open-source para visualização financeira existem mas são pouco "user-friendly"
- Guiabolso e Mobills dominam mas são "apps completos", não focados em visualização
- Comunidade brasileira valoriza open-source e privacidade

### B. Stakeholder Input

**Stakeholder:** Gabriel (Ideator)
- Visão: "Minhas finanças nunca foram tão bonitas"
- Foco: Simplicidade + Beleza + Gratuito
- Non-negotiable: Deve ser open-source

### C. References

- Repositório: https://github.com/GabrielBaim/finances_visualizer
- AIOS Framework: .aios-core/development/workflows/greenfield-fullstack.yaml

---

## Next Steps

### Immediate Actions

1. **Pesquisa de Mercado** (@analyst) - Analisar cenário de finanças pessoais no Brasil
2. **Análise de Concorrência** (@analyst) - Benchmark detalhado vs Guiabolso, Mobills, planilhas
3. **PRD Creation** (@pm) - Criar Product Requirements Document completo
4. **Validação Técnica** (@architect) - Prova de conceito de categorização IA

### PM Handoff

Este Project Brief fornece o contexto completo para **Visualizador de Finanças**.

**Para o Product Manager (@pm):**

Por favor inicie o modo de "Geração de PRD", revise este brief minuciosamente e trabalhe com o usuário para criar o PRD seção por seção conforme o template indica, pedindo qualquer clarificação necessária ou sugerindo melhorias.

**Principais decisões para validação no PRD:**
1. Confirmar escopo do MVP (upload + 4 gráficos + export + filtros)
2. Definir prioridade de categorização automática vs ed manual
3. Decidir modelo de autenticação (opcional MVP vs obrigatório v2)
4. Validar arquitetura proposta (React + Node + Vercel/Railway)

---

*Project Brief gerado por AIOS Framework*
*Agente: @analyst (Atlas)*
*Data: 2026-02-03*
