# EcoApuca — Como o projeto funciona

Documento de entendimento rápido. Serve para qualquer pessoa entender o projeto inteiro sem precisar ler código.

---

## Acesse agora pelo celular

<img src="public/qr-ecoapuca.png" alt="QR Code para abrir o EcoApuca" width="230" />

**https://gui-valente-01.github.io/EcoApuca/**

Aponte a câmera do celular para o código acima. O sistema abre direto no navegador — não precisa instalar nada, criar conta nem fazer login. Funciona em celular, tablet e computador.

---

## 1. O que é

**EcoApuca** é um programa municipal de reciclagem com recompensa. O cidadão entrega material reciclável num ecoponto, o operador pesa e valida, o sistema credita **EcoPontos** na carteira do cidadão, e ele troca esses pontos por benefícios de parceiros locais.

O que está no ar é uma **demonstração funcional (MVP)**: o fluxo completo funcionando de verdade, com dados simulados.

**A regra central do modelo:** o cidadão nunca gera pontos sozinho. Ponto só nasce depois de uma **pesagem validada por um operador**, com registro de quem pesou, onde, quando, qual material e quanto. É isso que impede fraude e é o que gera os dados do painel.

---

## 2. As 4 telas

Quatro áreas, acessíveis pelo menu lateral (ou pela barra inferior no celular).

### 2.1 Área do cidadão — a visão de quem recicla
- **Carteira de EcoPontos**: saldo atual, nível de participação (ex.: *Nível 3 · Guardião Verde*) e progresso para o próximo nível.
- **Código verde**: QR Code + código do cartão (`ECO-APU-1024`). É a identificação apresentada no ecoponto. Funciona também impresso, para quem não tem celular.
- **Resumo pessoal**: total reciclado em kg, entregas validadas e posição no ranking do bairro.
- **Missão da semana**: meta de 3 kg com anel de progresso. Ao concluir, rende **+20 pontos de bônus**, creditados automaticamente na coleta que fecha a meta.
- **Meta do bairro**: progresso coletivo (ex.: 4,1 de 5 toneladas para liberar um mutirão de plantio) — o gancho de engajamento comunitário.
- **Histórico da carteira**: extrato de entradas (coletas, em verde) e saídas (resgates, em vermelho).

### 2.2 Registrar coleta — a visão do operador do ecoponto
É a tela onde o ponto realmente nasce. Fluxo em 3 etapas:

1. **Identificar o cidadão** — lê o QR ou digita o código. Na demonstração, o código válido é **`ECO-APU-1024`** (ou só `1024`). Qualquer outro valor mostra erro, o que serve para demonstrar a validação.
2. **Informar material e peso** — escolhe o tipo de material e digita o peso da balança. O sistema calcula os pontos **em tempo real**, antes de confirmar.
3. **Confirmar** — gera o crédito, emite um comprovante com número de transação e o saldo do cidadão é atualizado na hora.

Ao lado fica o **comprovante** (após registrar) ou o cartão da "regra de ouro" (antes), mais as estatísticas do dia daquele ponto de coleta.

### 2.3 Recompensas — a economia local
Vitrine com os benefícios disponíveis. Se o saldo não cobrir, o botão fica desabilitado como *"Saldo insuficiente"* — a regra é visível, não é surpresa.

Ao resgatar, abre uma **confirmação** mostrando saldo atual → novo saldo antes de debitar. Confirmando, os pontos saem da carteira e o voucher aparece no histórico com um código.

| Recompensa | Parceiro | Custo |
|---|---|---|
| R$ 10 em compras | Mercado Bom Vizinho | 200 pts |
| Vale-transporte (2 passagens) | Mobilidade Apucarana | 300 pts |
| Cesta de hortaliças | Feira do Produtor | 400 pts |
| Kit de mudas nativas | Viveiro Municipal | 650 pts |

> No MVP não existe conversão de pontos em dinheiro. Ponto vira benefício, não saque.

### 2.4 Painel de impacto — a visão da gestão pública
Indicadores para a prefeitura acompanhar o piloto:
- **Números-chave**: recicláveis registrados, participantes ativos, pontos distribuídos e resgates realizados.
- **Evolução semanal**: gráfico de quilos por semana.
- **Composição dos materiais**: quanto de cada tipo está chegando.
- **Ranking de bairros**: onde a adesão cresce e onde precisa de campanha.
- **Impacto estimado**: CO₂ evitado e taxa de retorno dos participantes.

---

## 3. Como os pontos são calculados

**Pontos = peso (kg) × taxa do material** (arredondado), **+ 20** se a coleta fechar a missão semanal de 3 kg.

| Material | Pontos por kg |
|---|---|
| Metais | 20 |
| Óleo de cozinha | 15 |
| Plástico / PET | 12 |
| Papel e papelão | 8 |
| Vidro | 6 |

As taxas seguem o valor de revenda e a dificuldade de coletar cada material — metal vale mais, vidro vale menos.

*Exemplo:* 5 kg de PET × 12 = **60 pontos**. Se essa entrega fechar a meta semanal, vira **80 pontos**.

---

## 4. Tudo está conectado

O ponto mais importante: **não são quatro telas soltas**. Um único registro de coleta atualiza tudo ao mesmo tempo.

Registrar uma coleta →
- credita o saldo da carteira do cidadão;
- soma o peso no total pessoal e na missão da semana;
- adiciona a linha no histórico;
- soma no total do painel de gestão, na barra do material entregue e no gráfico semanal;
- aumenta o contador de pontos distribuídos e as estatísticas do ecoponto.

E resgatar uma recompensa debita o saldo, gera o voucher no histórico e sobe o contador de resgates do painel.

---

## 5. O que é real e o que é demonstrativo

| Real e funcionando | Demonstrativo |
|---|---|
| Cálculo de pontos por material e peso | Dados iniciais (saldo, histórico, ranking) |
| Missão semanal e bônus automático | Um único cidadão cadastrado (`ECO-APU-1024`) |
| Validação do código do cidadão | Estimativa de CO₂ evitado |
| Débito de pontos e emissão de voucher | Parceiros e recompensas |
| Atualização do painel em tempo real | QR Code do cidadão (é um desenho, não é escaneável) |

**Importante:** os dados ficam apenas na memória do navegador. **Ao recarregar a página, tudo volta ao estado inicial.** Isso é proposital — cada pessoa que abre o link começa do zero e pode testar à vontade, sem interferir em ninguém. Uma versão de produção precisaria de banco de dados, login e app do operador.

---

## 6. Roteiro de apresentação — 5 minutos

| Tempo | O que mostrar | O que dizer |
|---|---|---|
| 0:00–0:45 | **Área do cidadão** | "É assim que o morador vê: saldo, o código dele, a missão da semana e o extrato." |
| 0:45–2:15 | **Registrar coleta** — deixar `ECO-APU-1024` e 5 kg de PET, confirmar | "Aqui é o operador do ecoponto. Ele identifica, pesa e confirma. O ponto **só nasce aqui** — é o que evita fraude." Mostrar o cálculo mudando ao vivo e o comprovante gerado. |
| 2:15–3:00 | Voltar à **Área do cidadão** | "O saldo já subiu e a movimentação está no extrato. Instantâneo." |
| 3:00–4:00 | **Recompensas** — resgatar uma | "O ponto vira benefício em comércio local. O dinheiro circula na cidade." Mostrar a confirmação com saldo antes/depois. |
| 4:00–5:00 | **Painel de impacto** | "E a prefeitura enxerga tudo: quanto entrou, de qual material, em qual bairro. A reciclagem vira dado para decidir onde investir." |

**Fecho sugerido:** *"O programa devolve valor para quem recicla e devolve informação para quem administra a cidade."*

> Dica: mostre o QR do topo deste documento no telão. A plateia abre o sistema no próprio celular e testa junto.

---

## 7. Para desenvolvedores

### Rodar na própria máquina

```bash
npm install
npm run dev
```

Depois abrir `http://localhost:3000`. No Windows, dá para clicar duas vezes em `INICIAR_ECOAPUCA.bat`.

### Publicar

O site é republicado automaticamente a cada `git push` na branch `main`, pelo GitHub Actions. Leva cerca de 1 minuto.

### Mapa dos arquivos

| Arquivo | O que é |
|---|---|
| `app/page.tsx` | A aplicação inteira: as 4 telas, as regras de pontuação e todo o estado |
| `app/globals.css` | Todo o visual (cores, layout, responsividade) |
| `app/layout.tsx` | Estrutura base da página no modo local |
| `static-site/` + `vite.static.config.ts` | Build estático publicado no GitHub Pages (reaproveita o mesmo `app/page.tsx`) |
| `.github/workflows/deploy.yml` | Publicação automática |
| `public/qr-ecoapuca.png` / `.svg` | O QR Code deste documento (use o `.svg` para impressão) |
| `db/schema.ts`, `drizzle/`, `worker/` | Esqueleto de banco e nuvem, preparados mas **não usados** |

**Tecnologia:** React 19 + TypeScript + Vite, ícones Lucide. Sem servidor e sem banco de dados — são arquivos estáticos.
