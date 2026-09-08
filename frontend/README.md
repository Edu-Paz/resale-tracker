# Resale Tracker - Frontend

Aplicação web single-page (SPA) desenvolvida em React para gestão financeira de revendedores de itens usados. O frontend permite que usuários cadastrem itens, organizem por categorias, registrem vendas e acompanhem resultados financeiros (lucro/prejuízo) de forma intuitiva.

Este documento serve como referência completa para o Trabalho de Conclusão de Curso (TCC), detalhando todas as tecnologias, padrões de design, arquitetura e decisões técnicas implementadas no frontend.

---

## Índice

- [Visão Geral do Projeto](#visão-geral-do-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura da Aplicação](#arquitetura-da-aplicação)
- [Estrutura de Diretórios](#estrutura-de-diretórios)
- [Design System e Identidade Visual](#design-system-e-identidade-visual)
- [Componentes da Aplicação](#componentes-da-aplicação)
- [Páginas e Rotas](#páginas-e-rotas)
- [Serviços e Integração com API](#serviços-e-integração-com-api)
- [Gerenciamento de Estado](#gerenciamento-de-estado)
- [Validação de Formulários](#validação-de-formulários)
- [Tratamento de Erros](#tratamento-de-erros)
- [Acessibilidade](#acessibilidade)
- [Performance e Otimizações](#performance-e-otimizações)
- [Configuração e Build](#configuração-e-build)
- [Instalação e Execução](#instalação-e-execução)

---

## Visão Geral do Projeto

### Propósito

O Resale Tracker é uma ferramenta de controle financeiro voltada para revendedores autônomos e pequenos negócios que comercializam itens usados (tênis, eletrônicos, roupas, etc.). A aplicação permite:

- **Gestão de Inventário**: Cadastro de itens com preço de compra, data, categoria e imagem opcional
- **Organização por Categorias**: Criação e gerenciamento de categorias para agrupar produtos
- **Registro de Vendas**: Marcação de itens como vendidos com preço e data da venda
- **Cálculo Automático**: Cálculo automático de lucro/prejuízo e margem de lucro
- **Dashboard Financeiro**: Visualização clara de saldo acumulado, lucro realizado, prejuízo e capital em estoque
- **Filtros e Busca**: Filtragem por status, categoria e busca por nome

### Público-Alvo

Revendedores autônomos e pequenos negócios que necessitam de uma ferramenta simples e direta para controle financeiro, sem a complexidade de sistemas corporativos.

### Abordagem de Design

A interface foi concebida com estética de **ficha/etiqueta de inventário e carimbo de resultado**, inspirada em controles de estoque físicos. Isso evita o visual genérico de dashboards SaaS e cria uma identidade visual única relacionada ao domínio do produto.

---

## Tecnologias Utilizadas

### Core Framework

- **React 19.2.8**: Biblioteca JavaScript para construção de interfaces de usuário
  - Hooks: useState, useEffect, useMemo para gerenciamento de estado e efeitos colaterais
  - Componentes funcionais com JSX
  - StrictMode para detecção de problemas

- **React DOM 19.2.8**: Renderização do React no navegador

### Build Tool e Bundler

- **Vite 8.2.0**: Ferramenta de build e servidor de desenvolvimento
  - Hot Module Replacement (HMR) para desenvolvimento rápido
  - Build otimizado para produção
  - Suporte nativo a ES modules

- **@vitejs/plugin-react 6.0.4**: Plugin oficial do Vite para React

### Tipagem e Linting

- **TypeScript Definitions**: @types/react (19.2.17) e @types/react-dom (19.2.3)
  - Tipagem estática para melhor DX e prevenção de erros
  - IntelliSense aprimorado em IDEs

- **ESLint 10.8.0**: Linter para JavaScript/React
  - Configuração com ESLint Flat Config
  - Regras recomendadas para JavaScript moderno

- **eslint-plugin-react-hooks 7.1.1**: Regras específicas para React Hooks
  - Detecção de dependências faltantes em useEffect
  - Validação de regras dos Hooks

- **eslint-plugin-react-refresh 0.5.3**: Suporte ao React Refresh no Vite
  - Preservação de estado durante HMR

- **globals 17.7.0**: Definições de variáveis globais para ESLint

### Tipografia

- **IBM Plex Serif**: Fonte serifada para títulos e display (pesos 600-700)
- **IBM Plex Sans**: Fonte sans-serif para corpo de texto e UI (pesos 400-500)
- **IBM Plex Mono**: Fonte monoespaçada para dados numéricos, preços e datas (pesos 400-500, tabular figures)

As fontes são carregadas via Google Fonts no `index.html`.

### Padrões de Código

- **ES Modules**: Sistema de módulos nativo do JavaScript (type: "module" no package.json)
- **JSX**: Sintaxe de extensão do JavaScript para React
- **Component-Based Architecture**: Arquitetura baseada em componentes
- **Functional Components**: Uso exclusivo de componentes funcionais com Hooks

---

## Arquitetura da Aplicação

### Padrão Arquitetural

A aplicação segue uma arquitetura de **Single Page Application (SPA)** com as seguintes características:

- **Client-Side Routing**: Sistema de roteamento customizado baseado na History API do navegador
- **Component-Based**: Interface dividida em componentes reutilizáveis e independentes
- **Service Layer**: Camada de serviços para comunicação com a API REST
- **Session Management**: Gerenciamento de sessão via localStorage para persistência do token JWT
- **State Management**: Gerenciamento de estado local com React Hooks (sem bibliotecas externas como Redux)

### Fluxo de Dados

1. **User Interaction**: Usuário interage com componentes (formulários, botões)
2. **Event Handlers**: Componentes manipulam eventos e chamam funções de serviço
3. **API Communication**: Serviços fazem requisições HTTP para o backend
4. **State Update**: Estado dos componentes é atualizado com os dados retornados
5. **Re-render**: React re-renderiza os componentes com o novo estado

### Separação de Responsabilidades

- **Components**: Apresentação e interação da UI
- **Pages**: Composição de componentes para telas completas
- **Services**: Lógica de comunicação com a API
- **Routes**: Configuração de rotas e navegação
- **Styles**: Estilização CSS separada em arquivos modulares

---

## Estrutura de Diretórios

```
frontend/
├── public/                      # Arquivos estáticos
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/                  # Imagens e recursos estáticos
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/              # Componentes reutilizáveis
│   │   ├── AppLink.jsx          # Link customizado para navegação SPA
│   │   ├── AuthForm.jsx         # Formulário de autenticação (login/registro)
│   │   ├── CategoryForm.jsx     # Formulário de criação de categoria
│   │   ├── FeatureCard.jsx      # Card de funcionalidade (landing page)
│   │   ├── Footer.jsx           # Rodapé da aplicação
│   │   ├── ItemForm.jsx         # Formulário de cadastro de item
│   │   ├── ItemList.jsx         # Lista de itens com filtros e busca
│   │   ├── ResultBadge.jsx      # Badge de resultado (lucro/prejuízo)
│   │   └── SiteHeader.jsx       # Cabeçalho do site
│   ├── pages/                   # Páginas principais
│   │   ├── AuthPage.jsx         # Página de autenticação
│   │   ├── HomePage.jsx         # Landing page
│   │   ├── LoginPage.jsx        # Página de login (legado)
│   │   ├── RegisterPage.jsx     # Página de registro (legado)
│   │   └── UserPage.jsx         # Dashboard do usuário
│   ├── routes/                  # Configuração de rotas
│   │   ├── appRoutes.js         # Rotas principais da aplicação
│   │   └── routes.js            # Rotas legadas
│   ├── services/                # Serviços de API e sessão
│   │   ├── api.js               # Cliente HTTP e endpoints da API
│   │   └── session.js           # Gerenciamento de sessão (token)
│   ├── styles/                  # Estilos CSS
│   │   ├── base.css             # Variáveis CSS e estilos base
│   │   ├── components.css       # Estilos dos componentes
│   │   └── pages.css            # Estilos das páginas
│   ├── App.css                  # Estilos globais (legado)
│   ├── App.jsx                  # Componente raiz da aplicação
│   ├── index.css                # Importação de estilos
│   └── main.jsx                 # Ponto de entrada da aplicação
├── index.html                   # Template HTML principal
├── vite.config.js               # Configuração do Vite
├── eslint.config.js             # Configuração do ESLint
├── package.json                 # Dependências e scripts
├── package-lock.json            # Lockfile de dependências
├── DESIGN.md                    # Documentação de design system
├── API_REFERENCE.md             # Documentação da API
└── README.md                    # Este arquivo
```

---

## Design System e Identidade Visual

### Paleta de Cores

A paleta de cores foi definida seguindo o conceito de "ficha de inventário" com tons de papel kraft e tinta:

| Token | Hex | Uso |
|-------|-----|-----|
| `--kraft` | `#EDE6D6` | Fundo principal da aplicação (tom de papel kraft) |
| `--card` | `#FBF8F0` | Fundo de cards, tabelas e superfícies elevadas |
| `--ink` | `#1F2A24` | Texto principal, títulos, ícones (preto esverdeado) |
| `--ink-muted` | `#5C6B60` | Texto secundário, legendas, placeholders |
| `--line` | `#D8CBB0` | Bordas, divisores, linhas de tabela |
| `--ochre` | `#C98A2C` | Accent primário - botões, links, destaques, foco |
| `--focus` | `#9A651A` | Cor de foco (versão mais escura do ochre) |
| `--profit` | `#2F6F4E` | Semântico - lucro, item disponível/positivo |
| `--loss` | `#B23A32` | Semântico - prejuízo |
| `--profit-bg` | `#E4EEE7` | Fundo de badges de lucro |
| `--loss-bg` | `#F5E5E2` | Fundo de badges de prejuízo |

**Regras de Uso:**
- `--profit` e `--loss` são usados exclusivamente para indicar resultado financeiro, nunca decorativamente
- `--ochre` é o único accent ativo da interface
- Nunca usar preto puro (`#000`) ou branco puro (`#FFF`)

### Tipografia

Sistema tipográfico baseado na família IBM Plex com três papéis distintos:

| Papel | Fonte | Peso | Uso |
|-------|-------|------|-----|
| Display/Títulos | IBM Plex Serif | 600-700 | H1, H2, nomes de telas, valores destacados |
| Corpo/UI | IBM Plex Sans | 400-500 | Textos, labels, botões, navegação |
| Dados/Números | IBM Plex Mono | 400-500 | Preços, datas, IDs, tabelas (tabular-nums) |

**Escala Tipográfica:**

| Nível | Tamanho | Peso | Fonte |
|-------|---------|------|-------|
| H1 | 32px / 2rem | 700 | Plex Serif |
| H2 | 24px / 1.5rem | 600 | Plex Serif |
| H3 | 18px / 1.125rem | 600 | Plex Sans |
| Corpo | 15px / 0.9375rem | 400 | Plex Sans |
| Legenda/Label | 13px / 0.8125rem | 500, uppercase, letter-spacing 0.04em | Plex Sans |
| Dado numérico (tabela) | 15px | 500, tabular-nums | Plex Mono |
| Dado numérico (destaque) | 28px+ | 600, tabular-nums | Plex Mono |

### Layout e Espaçamento

- **Grid de Espaçamento**: Múltiplos de 4px (4, 8, 12, 16, 24, 32, 48, 64px)
- **Border-radius**: 6px em cards e inputs, 4px em badges/tags
- **Bordas**: 1px solid com `--line`, preferência por bordas finas a sombras pesadas
- **Sombra**: Sutil quando usada (`0 1px 2px rgba(31,42,36,0.06)`)
- **Cards**: Fundo `--card`, borda `--line`, padding 16-24px

### Componente-Assinatura: Carimbo de Resultado

Elemento único e memorável da interface que aparece em itens vendidos:

**Especificação:**
- Formato: Badge retangular com borda dupla de 1.5px
- Border-radius: 4px
- Rotação: -3deg (efeito de carimbo)
- Fundo: `--profit-bg` (lucro) ou `--loss-bg` (prejuízo)
- Texto: IBM Plex Mono, 600, uppercase, letter-spacing 0.05em
- Exemplo: `LUCRO +R$ 42,00 (28.5%)` ou `PREJUÍZO -R$ 15,00 (12.3%)`
- Uso exclusivo em itens com status SOLD

### Motion e Animações

Uso mínimo e funcional, nunca decorativo:

- Transições de cor/borda em hover e foco: 120ms ease-out
- Animação de escala no carimbo de resultado: 0.9 → 1.0, 150ms
- Respeito a `prefers-reduced-motion`
- Nenhum parallax, fade-in escalonado ou animações ambiente

### Voz e Texto da Interface

- Nomenclatura reconhecível pelo usuário: "Registrar venda", não "Atualizar status"
- Voz ativa: Botão "Registrar venda" → Confirmação "Venda registrada"
- Erros específicos sem desculpas: "Preço de venda deve ser maior que zero."
- Empty states como convite à ação: "Nenhum item em estoque ainda. Registre sua primeira compra."
- Todo conteúdo em português, sentence case

---

## Componentes da Aplicação

### AppLink.jsx

Componente de link customizado para navegação SPA que intercepta cliques e usa a History API.

**Responsabilidades:**
- Interceptar cliques em links para evitar recarregamento de página
- Chamar função de navegação passada via props
- Permitir navegação com modificadores (Ctrl+click, Cmd+click) para abrir em nova aba

**Props:**
- `href`: URL de destino
- `onNavigate`: Função de callback para navegação
- `children`: Conteúdo do link
- `className`: Classes CSS adicionais

### AuthForm.jsx

Formulário reutilizável para autenticação (login e registro).

**Responsabilidades:**
- Validação de campos (username, password, passwordConfirmation)
- Verificação de correspondência de senhas no registro
- Comunicação com API de login/registro
- Exibição de mensagens de erro e sucesso
- Gerenciamento de estado de submissão

**Validações:**
- Username: 3-20 caracteres, obrigatório
- Password: mínimo 6 caracteres, obrigatório
- PasswordConfirmation: deve igualar password (apenas registro)

**Estados:**
- `isSubmitting`: Indica se formulário está sendo submetido
- `errorMessage`: Mensagem de erro da API ou validação
- `successMessage`: Mensagem de sucesso após registro
- `passwordMismatch`: Indica se senhas não coincidem

### CategoryForm.jsx

Formulário para criação de categorias.

**Responsabilidades:**
- Validação de nome da categoria
- Comunicação com API para criar categoria
- Exibição de lista de categorias existentes
- Tratamento de erro de categoria duplicada (status 422)

**Estados:**
- `isSubmitting`: Indica se formulário está sendo submetido
- `formMessage`: Objeto com tipo (error/success) e texto da mensagem

### FeatureCard.jsx

Card simples para exibição de funcionalidades na landing page.

**Props:**
- `index`: Número/índice da funcionalidade
- `title`: Título da funcionalidade
- `description`: Descrição da funcionalidade

### Footer.jsx

Componente de rodapé com informações de copyright.

### ItemForm.jsx

Formulário complexo para cadastro de itens com funcionalidade de criação rápida de categoria.

**Responsabilidades:**
- Validação de dados do item (nome, preço, data, categoria)
- Validação de data (não pode ser futura)
- Validação de preço (deve ser maior que zero)
- Criação rápida de categoria inline
- Upload opcional de imagem via URL
- Comunicação com API para criar item

**Validações:**
- Nome: obrigatório
- Preço de compra: obrigatório, maior que zero
- Data de compra: obrigatória, não pode ser futura
- Categoria: obrigatória
- Imagem: opcional

**Estados:**
- `isSubmitting`: Indica se formulário está sendo submetido
- `formMessage`: Objeto com tipo e texto da mensagem
- `quickCategoryOpen`: Indica se painel de criação rápida está aberto
- `quickCategoryName`: Nome da nova categoria
- `itemCategory`: Categoria selecionada
- `buyDate`: Data de compra

### ItemList.jsx

Componente complexo para listagem de itens com filtros, busca e ordenação.

**Responsabilidades:**
- Exibição de itens em grid de cards
- Filtragem por status (Todos, Em estoque, Vendidos)
- Filtragem por categoria
- Busca por nome ou categoria
- Ordenação (recentes, antigos, maior preço, maior lucro)
- Cálculo de estatísticas do inventário
- Exibição de empty states
- Ações de edição, venda e exclusão

**Filtros:**
- Status: ALL, AVAILABLE, SOLD
- Categoria: Todas ou específica
- Busca: Texto livre por nome ou categoria
- Ordenação: recent, oldest, price-desc, profit-desc

**Estatísticas Calculadas:**
- Total em estoque (quantidade e valor investido)
- Itens vendidos (quantidade e resultado financeiro)
- Total de fichas cadastradas

**Estados:**
- `searchTerm`: Termo de busca
- `statusFilter`: Filtro de status
- `categoryFilter`: Filtro de categoria
- `sortBy`: Critério de ordenação

**Otimização:**
- Uso de `useMemo` para filtragem e ordenação de itens

### ResultBadge.jsx

Badge visual para exibição de resultado financeiro (lucro/prejuízo).

**Responsabilidades:**
- Formatação de valores monetários
- Cálculo de sinal (+/-)
- Aplicação de estilos condicionais (lucro/prejuízo)
- Exibição de margem percentual

**Props:**
- `profit`: Valor do lucro (positivo ou negativo)
- `margin`: Margem percentual

**Comportamento:**
- Valores positivos: estilo de lucro (verde)
- Valores negativos: estilo de prejuízo (vermelho)
- Rotação de -3deg para efeito de carimbo

### SiteHeader.jsx

Cabeçalho simples com logo da aplicação.

**Responsabilidades:**
- Exibição do logo como link para home
- Navegação SPA via AppLink

---

## Páginas e Rotas

### Sistema de Roteamento

A aplicação utiliza um sistema de roteamento customizado baseado na History API do navegador, sem bibliotecas externas como React Router.

**Arquivos:**
- `src/routes/appRoutes.js`: Rotas principais da aplicação
- `src/routes.js`: Rotas legadas (não utilizado)

**Rotas Definidas:**
```javascript
{
  home: '/',
  login: '/login',
  register: '/cadastro',
  user: '/usuario'
}
```

**Funcionamento:**
- `getRoute()`: Função que retorna a rota atual baseada em `window.location.pathname`
- `navigate()`: Função que usa `history.pushState()` para navegação sem recarregamento
- Event listener `popstate`: Detecta navegação pelo botão voltar/avançar do navegador

### HomePage.jsx

Landing page pública da aplicação.

**Seções:**
- Hero com título, descrição e CTAs (login/registro)
- Grid de funcionalidades principais
- Footer

**Funcionalidades:**
- Navegação para login e registro via AppLink
- Exibição de 3 funcionalidades principais (Gestão de inventário, Cálculo de lucro, Organização por categorias)

### AuthPage.jsx

Página de autenticação que combina login e registro.

**Responsabilidades:**
- Renderização de AuthForm com tipo apropriado (login/register)
- Exibição de conteúdo contextual (título, introdução)
- Navegação entre login e registro

**Estados:**
- `type`: 'login' ou 'register'
- `onNavigate`: Função de navegação
- `onAuthSuccess`: Callback para sucesso de autenticação

### UserPage.jsx

Dashboard principal do usuário, página mais complexa da aplicação.

**Responsabilidades:**
- Gerenciamento de sessão e autenticação
- Carregamento de dados do usuário, itens e categorias
- Navegação por abas (Visão geral, Itens, Adicionar item, Categorias)
- Exibição de métricas financeiras
- Gerenciamento de CRUD de itens
- Registro de vendas
- Edição e exclusão de itens

**Abas do Dashboard:**
1. **Visão Geral (overview)**: Métricas financeiras, itens em estoque, últimas vendas
2. **Itens (items)**: Lista completa de itens com filtros e busca
3. **Adicionar Item (item)**: Formulário para cadastro de novo item
4. **Categorias (category)**: Formulário para criação de categorias

**Subcomponentes:**
- `OverviewTab`: Tab de visão geral com métricas e listas resumidas
- `SellItemPanel`: Painel para registro de venda
- `EditItemPanel`: Painel para edição de item
- `DeleteItemDialog`: Modal de confirmação de exclusão

**Estados Principais:**
- `user`: Dados do usuário autenticado
- `items`: Lista de itens do usuário
- `categories`: Lista de categorias do usuário
- `activeTab`: Tab ativa do dashboard
- `sellingItem`: Item sendo vendido (modal)
- `editingItem`: Item sendo editado (modal)
- `deletingItem`: Item sendo excluído (modal)

**Métricas Calculadas:**
- Saldo acumulado (do backend)
- Lucro realizado (soma de profits positivos)
- Prejuízo total (soma absoluta de profits negativos)
- Capital em estoque (soma de buyPrice de itens AVAILABLE)

**Validações:**
- Data de venda não pode ser futura
- Data de venda não pode ser anterior à data de compra
- Preço de venda deve ser maior que zero
- Reversão de status SOLD → AVAILABLE remove dados de venda

---

## Serviços e Integração com API

### api.js

Cliente HTTP centralizado para comunicação com a API REST.

**Configuração:**
- URL base: `import.meta.env.VITE_API_URL || 'http://localhost:8080'`
- Content-Type padrão: `application/json`
- Tratamento centralizado de erros via classe `ApiError`

**Classe ApiError:**
```javascript
class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}
```

**Função request():**
Função genérica para requisições HTTP que:
- Adiciona headers padrão
- Faz parse do response JSON
- Lança ApiError para respostas não OK
- Retorna body da resposta

**Endpoints Implementados:**

**Autenticação:**
- `login(credentials)`: POST /auth/login
- `register(credentials)`: POST /users/register
- `getCurrentUser(token)`: GET /users/me

**Categorias:**
- `getCategories(token)`: GET /categories
- `createCategory(token, category)`: POST /categories

**Itens:**
- `getItems(token, categoryId)`: GET /items (com query param opcional)
- `createItem(token, item)`: POST /items
- `updateItem(token, itemId, item)`: PUT /items/{itemId}
- `sellItem(token, itemId, sellData)`: PATCH /items/{itemId}/sell
- `deleteItem(token, itemId)`: DELETE /items/{itemId}

**Tratamento de Erros:**
- Status 400: Erro de validação
- Status 403: Falha de autenticação
- Status 404: Recurso não encontrado
- Status 422: Violação de regra de negócio
- Status 500+: Erro de servidor

### session.js

Gerenciamento de sessão via localStorage.

**Funções:**
- `getToken()`: Recupera token do localStorage
- `saveToken(token)`: Salva token no localStorage
- `clearToken()`: Remove token do localStorage

**Chave de Storage:**
- `resale-tracker-token`: Chave usada para armazenar o JWT

---

## Gerenciamento de Estado

### Estratégia

A aplicação utiliza gerenciamento de estado local com React Hooks, sem bibliotecas externas como Redux ou Context API complexo.

### Padrões de Estado

**Estado Local do Componente:**
- Usado para dados que não precisam ser compartilhados
- Exemplos: estado de formulários, modais abertos/fechados, filtros

**Estado Elevado:**
- Estado elevado para componentes pai quando necessário compartilhar
- Exemplo: UserPage gerencia estado de itens e categorias, passa para filhos

**Estado Derivado:**
- Calculado a partir de outros estados usando `useMemo`
- Exemplo: itens filtrados e ordenados em ItemList

**Estado Sincronizado com API:**
- Carregado via useEffect ao montar componente
- Atualizado após operações CRUD
- Exemplo: lista de itens após criar novo item

### Exemplos de Gerenciamento de Estado

**Estado Local Simples:**
```javascript
const [searchTerm, setSearchTerm] = useState('')
const [statusFilter, setStatusFilter] = useState('ALL')
```

**Estado Derivado com useMemo:**
```javascript
const filteredItems = useMemo(() => {
  return items
    .filter(/* lógica de filtro */)
    .sort(/* lógica de ordenação */)
}, [items, statusFilter, categoryFilter, searchTerm, sortBy])
```

**Estado com Efeito Colateral:**
```javascript
useEffect(() => {
  const token = getToken()
  if (!token) {
    onNavigate(routes.login)
    return
  }

  Promise.all([getCurrentUser(token), getItems(token), getCategories(token)])
    .then(([currentUser, userItems, userCategories]) => {
      setUser(currentUser)
      setItems(userItems)
      setCategories(userCategories)
    })
    .catch((error) => {
      // tratamento de erro
    })
}, [onNavigate])
```

---

## Validação de Formulários

### Estratégia de Validação

A aplicação utiliza validação em múltiplas camadas:

1. **Validação Nativa HTML5**: Atributos como `required`, `min`, `max`, `pattern`
2. **Validação Customizada JavaScript**: Lógica específica de negócio
3. **Validação no Backend**: Validação final no servidor

### Validações Implementadas

**AuthForm:**
- Username: 3-20 caracteres (validação HTML5)
- Password: mínimo 6 caracteres (validação HTML5)
- PasswordConfirmation: deve igualar password (validação customizada)

**ItemForm:**
- Nome: required
- Preço de compra: required, min="0.01", step="0.01"
- Data de compra: required, max=data atual
- Categoria: required
- Validação customizada de data (não futura, formato válido)
- Validação customizada de preço (maior que zero)

**UserPage (EditItemPanel):**
- Todas as validações de ItemForm
- Data de venda: não pode ser anterior à data de compra
- Data de venda: não pode ser futura
- Preço de venda: deve ser maior que zero

### Funções de Validação

**parseDateInput():**
Valida e normaliza data no formato YYYY-MM-DD:
```javascript
function parseDateInput(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null

  const [, year, month, day] = match
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  
  // Verifica se a data é válida (evita 31/02 por exemplo)
  if (date.getFullYear() !== Number(year) || 
      date.getMonth() !== Number(month) - 1 || 
      date.getDate() !== Number(day)) return null

  return value
}
```

**validateItemFormInput():**
Validação completa de formulário de item:
```javascript
function validateItemFormInput({ name, buyPrice, buyDate, categoryId, status, sellPrice, sellDate }) {
  // Validações de compra
  const parsedBuyDate = parseDateInput(buyDate)
  if (!parsedBuyDate) return { error: 'Digite uma data válida no formato DD/MM/AAAA.' }
  if (parsedBuyDate > today) return { error: 'A data de compra não pode ser futura.' }
  
  // Validações de venda (se status SOLD)
  if (status === 'SOLD') {
    // Validações de preço e data de venda
  }
  
  return { data: /* objeto validado */ }
}
```

### Feedback de Validação

**Validação HTML5:**
- Uso de `onInvalid` e `onInput` para mensagens customizadas
- `setCustomValidity()` para mensagens específicas

**Validação Customizada:**
- Estados de erro (`errorMessage`, `formMessage`)
- Classes CSS condicionais (`input-error`)
- Atributos ARIA (`aria-invalid`, `role="alert"`)

---

## Tratamento de Erros

### Estratégia de Tratamento de Erros

A aplicação implementa tratamento de erros em múltiplos níveis:

1. **Camada de API**: Captura erros HTTP e lança `ApiError`
2. **Camada de Serviço**: Propaga erros para componentes
3. **Camada de Componente**: Exibe mensagens amigáveis ao usuário

### Tipos de Erros Tratados

**Erros de Rede:**
- Falha de conexão com servidor
- Timeout de requisição
- Tratamento com mensagem genérica: "Não foi possível conectar ao servidor."

**Erros de Autenticação:**
- Token inválido ou expirado (401/403)
- Redirecionamento para login
- Limpeza de token inválido

**Erros de Validação (400):**
- Campos obrigatórios faltando
- Formato inválido de dados
- Exibição de mensagem específica da API

**Erros de Regra de Negócio (422):**
- Categoria duplicada
- Venda de item já vendido
- Data de venda anterior à data de compra
- Exclusão de categoria com itens

**Erros de Servidor (500+):**
- Erro interno do servidor
- Mensagem genérica: "O servidor está indisponível no momento."

### Funções de Tratamento de Erro

**getErrorMessage() (AuthForm):**
```javascript
function getErrorMessage(error, isLogin) {
  if (error instanceof ApiError) {
    if (error.status === 400) return error.message
    if (error.status === 403 && isLogin) return error.message || 'Usuário ou senha inválidos.'
    if (error.status === 404) return 'Serviço de autenticação não encontrado.'
    if (error.status >= 500) return 'O servidor está indisponível no momento.'
    return error.message
  }
  return 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.'
}
```

**getFormErrorMessage() (ItemForm/CategoryForm):**
```javascript
function getFormErrorMessage(error) {
  if (error instanceof ApiError) return error.message
  return 'Não foi possível concluir a operação. Tente novamente.'
}
```

### Exibição de Erros

**Mensagens de Formulário:**
- Componentes de output com classes CSS
- Atributos ARIA para acessibilidade
- Ícones ou cores para indicar gravidade

**Mensagens Globais:**
- Estado de erro em página principal
- Possibilidade de retry ou redirecionamento

---

## Acessibilidade

### Práticas Implementadas

**HTML Semântico:**
- Uso de elementos apropriados (header, main, footer, nav, section, article)
- Hierarquia correta de headings (h1, h2, h3)
- Uso de dl/dt/dd para listas de definições

**ARIA Attributes:**
- `aria-label`: Labels descritivos para botões sem texto
- `aria-labelledby`: Associação de labels com elementos
- `aria-invalid`: Indicação de campos inválidos
- `aria-selected`: Estado de seleção em tabs
- `role`: Roles semânticos (alert, status, tablist, search)

**Navegação por Teclado:**
- Foco visível em elementos interativos
- Ordem lógica de tabulação
- Suporte a teclas Enter e Space
- `outline: 2px solid var(--focus)` em elementos focáveis

**Contraste de Cores:**
- Cores escolhidas para atender WCAG AA
- Texto sobre `--kraft` e `--card` com contraste suficiente
- Indicadores não dependentes apenas de cor (texto + cor para lucro/prejuízo)

**Formulários Acessíveis:**
- Labels associados a inputs
- Mensagens de erro com `role="alert"`
- Placeholder não substitui label
- Validação com feedback claro

**Responsividade:**
- Layout adaptável para diferentes tamanhos de tela
- Tabelas colapsam para cards em mobile
- Touch targets adequados (mínimo 44px)

**Reduced Motion:**
- Respeito a `prefers-reduced-motion`
- Desabilitação de animações quando solicitado
- Transformações removidas no carimbo de resultado

---

## Performance e Otimizações

### Otimizações Implementadas

**Code Splitting:**
- Vite realiza code splitting automático por rota
- Carregamento sob demanda de componentes

**Lazy Loading de Imagens:**
- Atributo `loading="lazy"` em imagens de itens
- Fallback para esconder imagem em caso de erro

**Memoização:**
- `useMemo` para cálculos pesados (filtragem, ordenação)
- Evita recálculos desnecessários em re-renders

**Otimização de Re-renders:**
- Componentes funcionais com dependências corretas
- Evita prop drilling desnecessário
- Estados locais quando possível

**Bundle Size:**
- Dependências mínimas (apenas React e Vite)
- Sem bibliotecas de UI pesadas
- CSS inline sem overhead adicional

**Network:**
- Requisições paralelas com `Promise.all`
- Cache de token em localStorage
- Reutilização de conexões HTTP

### Monitoramento de Performance

**Ferramentas:**
- React DevTools para profiling
- Vite DevTools para análise de bundle
- Lighthouse para auditoria de performance

**Métricas:**
- Time to Interactive (TTI)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)

---

## Configuração e Build

### Configuração do Vite

**vite.config.js:**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**Características:**
- Plugin React para suporte a JSX
- Configuração mínima e otimizada
- Hot Module Replacement habilitado por padrão

### Configuração do ESLint

**eslint.config.js:**
```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])
```

**Regras Aplicadas:**
- Regras recomendadas do JavaScript moderno
- Regras de React Hooks (dependências, regras de hooks)
- Suporte ao React Refresh
- Ignora diretório `dist`

### Scripts do package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

**Descrição:**
- `dev`: Inicia servidor de desenvolvimento com HMR
- `build`: Cria build de produção otimizado
- `lint`: Executa ESLint em todos os arquivos
- `preview`: Preview do build de produção localmente

### Variáveis de Ambiente

**VITE_API_URL:**
- URL base da API backend
- Padrão: `http://localhost:8080`
- Configuração via arquivo `.env` ou variável de ambiente

### Build de Produção

**Processo:**
1. Executar `npm run build`
2. Gerar diretório `dist/` com assets otimizados
3. Deploy do conteúdo de `dist/` para servidor web

**Otimizações:**
- Minificação de JavaScript e CSS
- Tree shaking para remover código não utilizado
- Hashing de nomes de arquivos para cache busting
- Geração de source maps para debugging

---

## Instalação e Execução

### Pré-requisitos

- **Node.js**: Versão 18+ (recomendado)
- **npm**: Versão 9+ (ou yarn/pnpm equivalente)
- **Backend**: API backend rodando em `http://localhost:8080` (ou configurado via VITE_API_URL)

### Instalação

1. **Clonar repositório:**
```bash
git clone git@github.com:Edu-Paz/resale-tracker.git
cd frontend
```

2. **Instalar dependências:**
```bash
npm install
```

### Execução em Desenvolvimento

1. **Iniciar servidor de desenvolvimento:**
```bash
npm run dev
```

2. **Acessar aplicação:**
```
http://localhost:5173
```

3. **Configurar URL da API (opcional):**
```bash
# Criar arquivo .env
echo "VITE_API_URL=http://localhost:8080" > .env
```

### Build de Produção

1. **Criar build:**
```bash
npm run build
```

2. **Preview do build:**
```bash
npm run preview
```

3. **Deploy:**
- Copiar conteúdo do diretório `dist/` para servidor web
- Configurar servidor para SPA (redirect de rotas para index.html)

### Linting

1. **Executar linter:**
```bash
npm run lint
```

2. **Auto-fix (se configurado):**
```bash
npm run lint -- --fix
```

---

## Considerações para TCC

### Pontos Técnicos Relevantes

1. **Arquitetura SPA sem Framework de Roteamento:**
   - Implementação customizada usando History API
   - Demonstração de conhecimento de APIs nativas do navegador

2. **Gerenciamento de Estado sem Bibliotecas Externas:**
   - Uso exclusivo de React Hooks
   - Padrões de estado local, elevado e derivado
   - Otimização com useMemo

3. **Design System Consistente:**
   - Paleta de cores baseada em conceito de domínio
   - Sistema tipográfico com três papéis distintos
   - Componente-assinatura único (carimbo de resultado)

4. **Acessibilidade:**
   - HTML semântico
   - ARIA attributes
   - Navegação por teclado
   - Contraste de cores
   - Suporte a reduced motion

5. **Performance:**
   - Code splitting automático
   - Lazy loading de imagens
   - Memoização de cálculos
   - Bundle size otimizado

6. **Validação Multi-camada:**
   - Validação HTML5
   - Validação customizada JavaScript
   - Validação no backend

7. **Tratamento de Erros Robusto:**
   - Classe customizada de erro
   - Tratamento por tipo de erro
   - Mensagens amigáveis ao usuário

8. **Integração com API REST:**
   - Cliente HTTP centralizado
   - Autenticação JWT
   - Tratamento de respostas e erros

### Decisões de Design Justificadas

1. **Por que React sem bibliotecas adicionais?**
   - Curva de aprendizado menor
   - Bundle size reduzido
   - Demonstração de conhecimento de fundamentos
   - Manutenibilidade simplificada

2. **Por que sistema de roteamento customizado?**
   - Evitar dependência desnecessária
   - Controle total sobre navegação
   - Compreensão de como funciona roteamento SPA

3. **Por que design system baseado em ficha de inventário?**
   - Identidade visual única relacionada ao domínio
   - Diferenciação de dashboards genéricos
   - Melhor usabilidade para público-alvo específico

4. **Por que IBM Plex fonts?**
   - Família coesa com três papéis distintos
   - Excelente legibilidade
   - Variação mono para dados numéricos (tabular figures)

---

## Conclusão

Este frontend do Resale Tracker demonstra a aplicação de boas práticas de desenvolvimento web moderno, com foco em:

- **Simplicidade**: Mínimo de dependências, máximo de funcionalidade
- **Performance**: Otimizações em múltiplos níveis
- **Acessibilidade**: Interface utilizável por todos
- **Manutenibilidade**: Código organizado e documentado
- **UX Focada**: Design system pensado para o usuário final

A aplicação serve como base sólida para o TCC, permitindo discussões sobre arquitetura, design, performance, acessibilidade e integração de sistemas frontend/backend.

---

## Documentação Adicional

- **DESIGN.md**: Documentação completa do design system
- **API_REFERENCE.md**: Documentação da API REST backend
- **Código Fonte**: Comentários no código para detalhes de implementação
