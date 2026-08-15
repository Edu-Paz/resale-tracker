# DESIGN.md — Identidade Visual · financial-api

Este documento define a identidade visual do produto e serve como referência para qualquer IA (Claude, Gemini, etc.) gerar telas consistentes. Sempre que você pedir uma tela, cole ou referencie este arquivo — as decisões de cor, tipografia, layout e tom de voz abaixo são a fonte da verdade.

---

## 0. Contexto de design (não pular)

**Produto:** ferramenta de controle financeiro para revendedores de itens usados (tênis, eletrônicos, roupas, etc.) — a pessoa compra um item, cadastra, depois vende e o app mostra se deu lucro ou prejuízo.

**Público:** revendedor autônomo/pequeno, não é um analista financeiro — quer clareza rápida ("esse item deu lucro ou não?"), não um dashboard corporativo denso.

**O trabalho da interface:** deixar óbvio, em um relance, o estado de cada item (em estoque / vendido) e o resultado financeiro (lucro / prejuízo), com a mesma sensação de organização de um caderno de controle ou ficha de estoque — não de um SaaS financeiro genérico.

**Direção escolhida:** estética de **ficha/etiqueta de inventário e carimbo de resultado** — like um controle de estoque físico (etiquetas, fichas, carimbo de "vendido"), traduzido para digital. Isso nasce diretamente do domínio (produto tem preço de compra, preço de venda, uma etiqueta de imagem, uma categoria) e evita o visual genérico de dashboard SaaS.

> ⚠️ Evitar deliberadamente: (1) fundo creme + serifada + accent terracota (visual "IA genérica" #1); (2) fundo quase preto + verde-neon/vermelho vibrante único; (3) layout jornal com hairlines e zero border-radius. Nenhum dos três tem relação com o domínio deste produto.

---

## 1. Paleta de Cores

| Token | Hex | Uso |
|---|---|---|
| `--kraft` | `#EDE6D6` | Fundo principal da aplicação (tom de papel kraft/ficha, não branco puro nem creme) |
| `--card` | `#FBF8F0` | Fundo de cards, tabelas e superfícies elevadas |
| `--ink` | `#1F2A24` | Texto principal, títulos, ícones (preto levemente esverdeado, "tinta de caderno") |
| `--ink-muted` | `#5C6B60` | Texto secundário, legendas, placeholders |
| `--line` | `#D8CBB0` | Bordas, divisores, hairlines de tabela |
| `--ochre` | `#C98A2C` | Accent primário — botões principais, links, destaques, foco |
| `--profit` | `#2F6F4E` | Semântico fixo — **lucro**, item disponível/positivo |
| `--loss` | `#B23A32` | Semântico fixo — **prejuízo** |
| `--profit-bg` | `#E4EEE7` | Fundo de badges/stamps de lucro |
| `--loss-bg` | `#F5E5E2` | Fundo de badges/stamps de prejuízo |

**Regras rígidas:**
- `--profit` e `--loss` **nunca** trocam de significado e **nunca** são usados decorativamente — só aparecem quando há um valor de lucro/prejuízo ou status disponível/vendido real.
- `--ochre` é o único accent "ativo" da interface (botões primários, links, foco de input). Não introduzir uma segunda cor de accent.
- Nunca usar preto puro (`#000`) ou branco puro (`#FFF`) — sempre `--ink` e `--card`/`--kraft`.

---

## 2. Tipografia

Família única com três papéis, para dar coesão sistemática (like uma planilha bem tipografada):

| Papel | Fonte | Uso |
|---|---|---|
| Display / títulos | **IBM Plex Serif**, peso 600–700 | H1, H2, nome de telas, valores de destaque no dashboard |
| Corpo / UI | **IBM Plex Sans**, peso 400–500 | Textos, labels, botões, navegação |
| Dados / números | **IBM Plex Mono**, peso 400–500, tabular figures | Preços, datas, IDs, tabelas — **todo valor monetário usa mono** |

### Escala tipográfica

| Nível | Tamanho | Peso | Fonte |
|---|---|---|---|
| H1 | 32px / 2rem | 700 | Plex Serif |
| H2 | 24px / 1.5rem | 600 | Plex Serif |
| H3 | 18px / 1.125rem | 600 | Plex Sans |
| Corpo | 15px / 0.9375rem | 400 | Plex Sans |
| Legenda / label | 13px / 0.8125rem | 500, uppercase, letter-spacing 0.04em | Plex Sans |
| Dado numérico (tabela) | 15px | 500, tabular-nums | Plex Mono |
| Dado numérico (destaque) | 28px+ | 600, tabular-nums | Plex Mono |

**Regra fixa:** qualquer preço, saldo, lucro ou data em uma tela usa `IBM Plex Mono` com `font-variant-numeric: tabular-nums`, nunca a fonte de corpo. Isso é o que dá a sensação de "ficha/planilha confiável".

---

## 3. Layout, Espaçamento e Forma

- **Grid de espaçamento:** múltiplos de 4px — 4, 8, 12, 16, 24, 32, 48, 64.
- **Border-radius:** 6px em cards e inputs, 4px em badges/tags. Nunca `0` (não é o estilo jornal) nem `> 12px` (não é o estilo SaaS arredondado/fofo).
- **Bordas:** `1px solid var(--line)` em cards e tabelas — preferir borda fina a sombra pesada. Sombra, quando usada, é sutil (`0 1px 2px rgba(31,42,36,0.06)`), nunca drop-shadow forte.
- **Cards:** fundo `--card`, borda `--line`, padding 16–24px. Pense neles como "fichas" — um pouco mais formais que um card de app comum.
- **Tabelas/listas:** linhas divididas por `--line`, sem zebra-striping colorido; hover de linha usa `--kraft` como leve destaque.

---

## 4. Componente-assinatura: o Carimbo de Resultado

Este é o elemento único e memorável da interface — aparece sempre que um item vendido mostra seu resultado financeiro (lista de itens, tela de detalhe, dashboard).

**Especificação:**
- Formato: badge retangular, borda dupla de 1.5px, `border-radius: 4px`, leve rotação `-3deg`.
- Fundo: `--profit-bg` (lucro) ou `--loss-bg` (prejuízo).
- Texto: `IBM Plex Mono`, 600, uppercase, letter-spacing 0.05em — ex: `LUCRO +R$ 42,00` ou `PREJUÍZO -R$ 15,00`.
- Cor do texto e da borda: `--profit` ou `--loss`, conforme o caso.
- Uso: **somente** em itens com `status = SOLD`. Itens `AVAILABLE` não recebem carimbo — recebem, no máximo, uma tag simples e neutra "Em estoque" (sem rotação, cor `--ink-muted`).

Esse carimbo é o elemento em que vale a pena "gastar" o toque de personalidade da interface — o resto da tela deve ser discreto e disciplinado ao redor dele.

---

## 5. Componentes de UI

- **Botão primário:** fundo `--ochre`, texto `--card`, `border-radius: 6px`, sem sombra, peso 500. Hover: escurece ~8%.
- **Botão secundário:** fundo transparente, borda `1px solid var(--line)`, texto `--ink`.
- **Botão destrutivo (excluir):** borda `--loss`, texto `--loss`, fundo transparente; confirmação sempre exigida antes de excluir.
- **Input:** fundo `--card`, borda `--line`, foco muda borda para `--ochre` (sem glow/shadow colorido).
- **Badge de categoria:** fundo `--kraft`, texto `--ink-muted`, uppercase, pequeno, `border-radius: 4px` — visual de etiqueta simples, sem cor própria por categoria (evita poluição visual).
- **Empty state:** ilustração mínima ou nenhuma; texto direto convidando à ação (ver seção de voz).

---

## 6. Motion

Uso mínimo e funcional, nunca decorativo:
- Transição de cor/borda em hover e foco: 120ms ease-out.
- Ao marcar um item como vendido, o carimbo de resultado pode "carimbar" com uma pequena animação de escala (0.9 → 1.0, 150ms) — é o único momento que merece uma microinteração deliberada.
- Nada de parallax, fade-in escalonado de lista, ou animações ambiente. `prefers-reduced-motion` sempre respeitado.

---

## 7. Voz e Texto da Interface

- Nomeie pelo que a pessoa reconhece: "Registrar venda", não "Atualizar status do recurso".
- Voz ativa, mesmo rótulo do início ao fim do fluxo: botão "Registrar venda" → confirmação "Venda registrada".
- Erros não se desculpam e são específicos: "Preço de venda deve ser maior que zero." (não "Ops, algo deu errado").
- Estado vazio é convite à ação, não decoração: "Nenhum item em estoque ainda. Registre sua primeira compra." com o botão logo abaixo.
- Tudo em português, sentence case (não Title Case em botões: "Salvar categoria", não "Salvar Categoria").

---

## 8. Acessibilidade (piso mínimo, sempre)

- Contraste mínimo AA para texto sobre `--kraft` e `--card`.
- Foco de teclado sempre visível (borda `--ochre` de 2px, nunca `outline: none` sem substituto).
- Cor nunca é o único indicador de lucro/prejuízo — sempre acompanhada do texto "LUCRO"/"PREJUÍZO" no carimbo, nunca só uma bolinha colorida.
- Responsivo até mobile — tabelas de itens colapsam para cards empilhados abaixo de 640px, mantendo o carimbo de resultado visível.

---

## 9. Checklist rápido para qualquer tela nova

Ao gerar uma tela, confirmar:
1. Fundo `--kraft`, cards `--card`, texto `--ink`.
2. Títulos em Plex Serif, corpo em Plex Sans, **todo número/preço em Plex Mono tabular**.
3. Único accent ativo é `--ochre`.
4. Lucro/prejuízo só aparece como o Carimbo de Resultado (seção 4), nunca como cor solta.
5. Radius 6px (cards/inputs) / 4px (badges), bordas finas, sem sombra pesada.
6. Copy em voz ativa, sentence case, sem pedir desculpas em erros.
7. Nenhuma animação além das descritas na seção 6.
