# IDENTIDADE VISUAL OFICIAL — REVENDIR

Este diretório contém o kit oficial de identidade visual e design tokens da **Revendi**, estruturado com base na **Opção 4: Dark Carvão & Verde Neon**.

---

## 🎨 Paleta de Cores e Tokens de Design

| Função | Nome | Hex | Tailwind Class | Uso na Aplicação |
| :--- | :--- | :--- | :--- | :--- |
| **Acento Primário** | Verde Neon | `#22C55E` | `bg-emerald-500` / `text-green-500` | Botões primários, valores de lucro, destaque positivo |
| **Destaque Claro** | Verde Menta | `#4ADE80` | `text-green-400` | Gradientes, porcentagens de margem, hover de links |
| **Fundo Global** | Preto Carvão | `#09090B` | `bg-zinc-950` | Fundo principal da Single Page Application |
| **Superfície Cards** | Grafite Fosco | `#18181B` | `bg-zinc-900` | Cards do dashboard, modais, linhas de tabela |
| **Bordas Sutis** | Borda Zinc | `#27272A` | `border-zinc-800` | Divisórias e bordas de inputs e containers |
| **Texto Primário** | Branco Gelo | `#F4F4F5` | `text-zinc-100` | Títulos, saldo financeiro, nomes de itens |
| **Texto Muted** | Cinza Neutro | `#A1A1AA` | `text-zinc-400` | Legendas, datas, placeholders e rótulos secundários |

---

## 💻 Configuração Pronta para o React / Tailwind CSS

Copie e cole no seu arquivo `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        revendi: {
          bg: '#09090B',
          surface: '#18181B',
          border: '#27272A',
          neon: '#22C55E',
          mint: '#4ADE80',
          text: '#F4F4F5',
          muted: '#A1A1AA',
        }
      }
    },
  },
  plugins: [],
}
```

### Variáveis CSS Nativas (`index.css`):

```css
:root {
  --bg-primary: #09090B;
  --bg-surface: #18181B;
  --border-subtle: #27272A;
  --accent-neon: #22C55E;
  --accent-mint: #4ADE80;
  --text-main: #F4F4F5;
  --text-muted: #A1A1AA;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-main);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

---

## 📁 Relação dos Arquivos de Imagem Disponíveis

1. **Prancha de Diretrizes Visuais:** `prancha_brand_guidelines_revendi.png`
2. **Logotipo Horizontal (Navbar):** `logo_revendi_horizontal_dark.png` e `logo_revendi_horizontal.svg`
3. **Logotipo Vertical (Login / Splash):** `logo_revendi_vertical_splash.png`
4. **Ícone do App (Square / PWA):** `app_icon_revendi_512.png` e `app_icon_revendi_192.png`
5. **Favicon (Navegador):** `favicon_revendi_64.png` e `icon_revendi.svg`
6. **Banner de Compartilhamento (OpenGraph):** `banner_social_opengraph_1200x630.png`
