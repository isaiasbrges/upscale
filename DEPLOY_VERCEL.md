# Publicação na Vercel

## 1. Banco de dados

Crie um PostgreSQL gerenciado (Neon, Supabase ou Vercel Marketplace) e copie a URL de conexão. Não use SQLite na Vercel: o disco das funções não é persistente.

## 2. Variáveis de ambiente

Cadastre em **Project Settings > Environment Variables**:

- `DATABASE_URL`: conexão PostgreSQL com SSL.
- `SESSION_SECRET`: segredo aleatório com pelo menos 32 caracteres.
- `NEXT_PUBLIC_APP_URL`: URL principal do painel, sem barra final.
- `VERCEL_TOKEN`: token com acesso ao projeto (opcional, necessário para cadastrar domínios pelo painel).
- `VERCEL_PROJECT_ID`: ID do projeto (opcional).
- `VERCEL_TEAM_ID`: ID da equipe quando o projeto pertencer a uma equipe (opcional).

As variáveis `ADMIN_NAME`, `ADMIN_EMAIL` e `ADMIN_PASSWORD` só são necessárias ao executar o seed inicial.

## 3. Primeiro deploy

Conecte o repositório GitHub à Vercel. O arquivo `vercel.json` já configura `npm ci` e `npm run build`.

Depois de cadastrar `DATABASE_URL`, execute uma vez, em uma máquina com acesso ao banco:

```bash
npm ci
npm run db:deploy
npm run db:seed
```

O seed exige uma senha administrativa com pelo menos 12 caracteres e pode ser executado novamente com segurança.

## 4. Domínios dos clientes

Cadastre a URL principal do painel diretamente na Vercel. Para os clientes, abra **Domínios** no dashboard e informe o domínio ou subdomínio. Quando as variáveis `VERCEL_*` estiverem presentes, o sistema adiciona e remove o hostname na Vercel automaticamente.

No provedor DNS do cliente, use o registro solicitado pela tela de domínios da Vercel. Subdomínios normalmente usam CNAME; domínios raiz normalmente usam A/ALIAS conforme a orientação exibida pela Vercel.

Somente campanhas com status **PUBLISHED** são exibidas publicamente.

## 5. Deploys seguintes

Novos pushes na branch de produção disparam o deploy automaticamente. Quando houver uma nova migração Prisma, execute `npm run db:deploy` antes de liberar a versão.
