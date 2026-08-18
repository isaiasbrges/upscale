# UpScale Design System - Migração Fase 1

Este documento registra as alterações realizadas na Fase 1 da migração visual da aplicação para o novo UpScale Design System. Nenhuma funcionalidade de banco de dados, roteamento ou lógica de formulários foi modificada nesta etapa.

## 1. Tokens Definidos (`src/design-system/tokens/`)

Centralizamos todas as decisões visuais em arquivos dedicados:

- **`colors.ts`**: Paleta oficial estabelecida.
  - Background base: `#07090B` e `#0C0F12`.
  - Surfaces: `#111519` e `#171C21`.
  - Foreground: `#F7F8F8`, `#A5ADB4`, `#6D7580`.
  - Semânticas: Primary (`#25D366`), Danger (`#F25353`), Warning (`#F5BD34`), Info (`#3485FF`).
  - Cores inconsistentes (violet e emerald) foram removidas da paleta principal.
- **`radius.ts`**: Escala exata padronizada (6px, 10px, 14px, 20px, 28px, 999px).
- **`shadows.ts`**: Sombras pesadas e glows neon foram removidos. Reduzido para `sm`, `md` e `floating`.
- **`spacing.ts`**: Escala determinística (4, 8, 12, 16, 20, 24, 32, 40, 48, 64).
- **`typography.ts`**: Adotada a fonte `Manrope` com hierarquia bem definida (Page title, Section title, Body, Small, Label).
- **`motion.ts`**: Definidas durações (`fast`, `normal`, `slow`) e easing centralizado (`cubic-bezier(.22, 1, .36, 1)`).

## 2. Configuração do Tailwind (`src/app/globals.css`)

O arquivo principal de estilos foi atualizado para utilizar a engine do **Tailwind CSS v4** com as novas variáveis (`@theme inline`), garantindo que todos os tokens descritos acima se transformem em classes utilitárias utilizáveis em toda a aplicação (ex: `bg-surface`, `text-primary`, `rounded-md`).

## 3. Componentes Base Refatorados (`src/components/ui/`)

Foram atualizados para utilizar os novos tokens globais, preservando as suas props originais (total compatibilidade com os formulários atuais):

- **`button.tsx`**: Variantes `primary`, `secondary`, `ghost`, `danger`. Removido efeito agressivo de `hover:scale` em favor de uma transição de background e `active:scale-[0.98]`. Radius padrão: 10px (`sm`). Altura padrão: 44px (`h-11`).
- **`input.tsx`**: Fundo `bg-surface`, bordas sutis e foco com anel `primary/20`. Altura 44px.
- **`textarea.tsx`**: Refletindo a mesma atualização visual do `Input`.
- **`label.tsx`**: Ajustado para cor `foreground-secondary` e peso `semibold`.

## 4. Novos Componentes Modulares (`src/design-system/components/`)

Novos blocos visuais criados do zero para serem usados na Fase 2 da migração (na refatoração dos layouts das páginas):

- **`card.tsx`**: Componente de container flexível com variantes `default`, `elevated` e `interactive`.
- **`panel.tsx`**: Estrutura composta (`Panel`, `PanelHeader`, `PanelContent`, `PanelFooter`) para agrupar formulários administrativos e configurações.
- **`badge.tsx`**: Marcadores de estado semânticos (`neutral`, `success`, `warning`, `danger`, `info`).
- **`page-header.tsx`**: Cabeçalho padrão para páginas administrativas, contendo suporte a breadcrumbs, título, descrição e ações.
- **`empty-state.tsx`**: Placeholder moderno para guiar o usuário em listas e tabelas vazias.

## 5. Arquivos Modificados
- `src/app/globals.css`
- `src/components/ui/button.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/textarea.tsx`
- `src/components/ui/label.tsx`

## 6. Arquivos Criados
- `src/design-system/tokens/colors.ts`
- `src/design-system/tokens/radius.ts`
- `src/design-system/tokens/shadows.ts`
- `src/design-system/tokens/spacing.ts`
- `src/design-system/tokens/typography.ts`
- `src/design-system/tokens/motion.ts`
- `src/design-system/components/card.tsx`
- `src/design-system/components/panel.tsx`
- `src/design-system/components/badge.tsx`
- `src/design-system/components/page-header.tsx`
- `src/design-system/components/empty-state.tsx`
- `DESIGN_MIGRATION_PHASE_1.md`

## 7. Compatibilidade Encontrada
- **Nenhuma Incompatibilidade Grave:** Todos os componentes do `src/components/ui` mantiveram a assinatura de `props` do React original, fazendo com que as chamadas existentes nas páginas continuassem funcionando sem erros. 
- O Builder e as páginas do painel foram isolados dessa alteração inicial. Seu comportamento não foi afetado.
