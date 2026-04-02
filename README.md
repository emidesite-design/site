# EMide Landing Page

Landing page em React para o DJ EMide, com foco em responsividade, direcao visual forte e separacao limpa entre UI, caso de uso e infraestrutura de midia.

## Stack

- React 18
- TypeScript
- Vite

## Como rodar

```bash
npm install
npm run dev
```

## Ambiente

Use `.env.local` ou as variaveis da Vercel para centralizar configuracoes.

- Obrigatorias hoje:
  `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- Opcional para o presskit via manifesto publico:
  `VITE_SUPABASE_PRESSKIT_URL`
- Opcional para shorts via manifesto publico:
  `VITE_SUPABASE_SHORTS_URL`
- Opcional apenas para o script `npm run sync:presskit`:
  `SUPABASE_PRESSKIT_MANIFEST_URL`

Regra importante: tudo com prefixo `VITE_` vai para o browser. Nao coloque segredos reais nessas variaveis.

## Arquitetura

```text
src/
  app/                composicao da aplicacao
  application/        casos de uso
  domain/             entidades e contratos
  infrastructure/     implementacao de acesso a midia
  presentation/       hooks e secoes da landing page
  shared/             config e dados de fallback
  styles/             tokens e estilos globais
```

## Supabase Storage

O presskit agora consome um manifesto JSON publico, ideal para hospedar no Supabase Storage e servir na Vercel sem expor segredos no browser.
Os shorts tambem podem seguir o mesmo padrao, evitando leitura direta no banco em toda visita.

- fallback local: `/data/presskit.json`
- opcional via env no front: `VITE_SUPABASE_PRESSKIT_URL`
- fallback local para videos: `/data/shorts.json`
- opcional via env no front para videos: `VITE_SUPABASE_SHORTS_URL`
- opcional via env no script de sync local: `SUPABASE_PRESSKIT_MANIFEST_URL`

Exemplo de `.env`:

```bash
VITE_SUPABASE_PRESSKIT_URL=https://<project-ref>.supabase.co/storage/v1/object/public/presskit/presskit.json
VITE_SUPABASE_SHORTS_URL=https://<project-ref>.supabase.co/storage/v1/object/public/shorts/shorts.json
SUPABASE_PRESSKIT_MANIFEST_URL=https://<project-ref>.supabase.co/storage/v1/object/public/presskit/presskit.json
```

Formato esperado do manifesto:

```json
{
  "images": [
    {
      "id": "emide-01",
      "url": "https://<project-ref>.supabase.co/storage/v1/object/public/presskit/emide-01.jpg",
      "width": 1600,
      "height": 2000,
      "alt": "EMIDE promo still"
    }
  ]
}
```

## Cliente Supabase

O client compartilhado fica em `src/shared/lib/supabase.ts` e deve ser usado apenas com a chave publishable no frontend.
Para reduzir abuso por refresh e custo de leitura, o app prioriza manifestos publicos cacheados no navegador; o Supabase direto fica apenas como fallback.

Exemplo:

```ts
import { supabase } from "@/shared/lib/supabase";

const { data, error } = await supabase.from("todos").select("*");
```
