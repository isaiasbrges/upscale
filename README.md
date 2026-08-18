# Upscale V1 Ready

Base preparada para iniciar o Builder da Upscale.

## O que já está estruturado

- Block Registry
- Biblioteca de blocos
- Hero Premium
- Scaffold da Raspadinha 90X
- Renderer dinâmico
- Inspector automático baseado em schema
- Preview em tempo real
- Estrutura Prisma para Client > Campaign > Page > Block

## Como iniciar

Crie um projeto Next.js com App Router ou use esta pasta como base.

```bash
npm install
```

Configure:

```env
DATABASE_URL="postgresql://..."
```

Depois:

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Abra:

```text
/builder/demo
```

## Como mandar uma nova seção para o Builder

Crie:

```text
src/blocks/nome-do-bloco/
  component.tsx
  index.ts
```

No `index.ts`, registre:
- type
- name
- category
- version
- component
- defaultConfig
- fields

Depois importe em:

```text
src/blocks/registry.ts
```

A seção passa automaticamente a aparecer na biblioteca e seu painel de configuração é gerado a partir de `fields`.

## Regra importante

Não salvar HTML bruto dentro das campanhas.

O banco salva somente:

```json
{
  "type": "hero-premium",
  "version": 1,
  "config": {}
}
```

O visual real fica no componente React, garantindo consistência entre clientes.
