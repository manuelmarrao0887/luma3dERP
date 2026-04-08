# 🧊 Luma 3D — ERP

Sistema de gestão para o negócio de impressão 3D **Luma 3D**.

Gestão de produtos, clientes, encomendas, materiais, cálculo de margens e licenças comerciais — tudo num único painel responsivo.

## Funcionalidades

- **Dashboard** — Receita, lucro, encomendas ativas, custo mensal de licenças, top produtos, alertas de stock
- **Produtos** — Catálogo com 20 produtos, filtro por categoria, licenças comerciais (Patreon/MakerWorld/Gratuita), links MakerWorld, notas de produção
- **Encomendas** — Criar, editar, filtrar por estado, cálculo automático de custos/taxas Etsy/Vinted/lucro
- **Clientes** — Registo completo com canal de aquisição (Etsy/Vinted), histórico de encomendas, gasto total
- **Materiais** — Stock de filamentos com cor visual, custo/kg, alerta stock baixo
- **Calculadora** — Simulador de margens (filamento + eletricidade + mão de obra + taxa plataforma)
- **Definições** — Custos operacionais, taxas Etsy/Vinted, dados do negócio

## Stack

- React 18 + Vite
- localStorage para persistência de dados
- Zero dependências externas (sem backend, sem base de dados)
- 100% responsivo (mobile + desktop)

## Instalação

```bash
# Clonar o repositório
git clone https://github.com/SEU-USERNAME/luma3d-erp.git
cd luma3d-erp

# Instalar dependências
npm install

# Arrancar em modo desenvolvimento
npm run dev

# Abrir no browser
# http://localhost:5173
```

## Deploy no GitHub Pages (gratuito)

### Opção 1: Manual

```bash
npm run build
# Faz upload da pasta dist/ para o GitHub Pages
```

### Opção 2: Vercel (recomendado — gratuito)

1. Vai a [vercel.com](https://vercel.com)
2. Liga a tua conta GitHub
3. Importa o repositório `luma3d-erp`
4. Clica "Deploy"
5. Pronto — tens o ERP online em `luma3d-erp.vercel.app`

### Opção 3: Netlify (gratuito)

1. Vai a [netlify.com](https://netlify.com)
2. Arrasta a pasta `dist/` para o dashboard
3. Pronto — tens URL pública

## Dados

Os dados são guardados no **localStorage** do browser. Isto significa:
- Os dados ficam no teu computador/telemóvel
- Não são enviados para nenhum servidor
- Se limpares o cache do browser, perdes os dados
- Para backup: exporta os dados nas Definições (funcionalidade futura)

## Licença

Projecto privado — Luma 3D © 2026
