# EcoApuca — demonstração funcional

Projeto local do EcoApuca para abrir no Visual Studio Code e apresentar mesmo sem internet.

## Como executar no VS Code

1. Instale o [Node.js 22](https://nodejs.org/) ou uma versão mais recente.
2. Abra esta pasta no Visual Studio Code.
3. No menu do VS Code, clique em **Terminal > Novo Terminal**.
4. Execute:

```powershell
npm install
npm run dev
```

5. Abra no navegador o endereço mostrado no terminal. Normalmente será:

```text
http://localhost:3000
```

Na primeira execução, o `npm install` pode levar alguns minutos. Nas próximas vezes, basta executar `npm run dev`.

## Atalho para Windows

Também é possível clicar duas vezes no arquivo `INICIAR_ECOAPUCA.bat`. Ele instala o necessário na primeira execução e inicia o site.

## Roteiro rápido da apresentação

1. Mostre a área do cidadão com saldo, código, missão e histórico.
2. Entre em **Registrar coleta** e confirme os 5 kg de PET já preenchidos.
3. Volte à carteira para mostrar o novo saldo e a movimentação registrada.
4. Resgate uma recompensa para demonstrar o débito de pontos e o voucher.
5. Termine no painel de impacto, que também recebe os dados da coleta.

Os dados são demonstrativos e voltam ao estado inicial quando a página é recarregada.
