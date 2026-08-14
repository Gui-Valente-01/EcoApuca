"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Bus,
  Check,
  CheckCircle2,
  Gift,
  History,
  LayoutDashboard,
  Leaf,
  MapPin,
  Menu,
  Package,
  QrCode,
  Recycle,
  Scale,
  Search,
  ShoppingBag,
  Sprout,
  Trophy,
  UserRound,
  Users,
  WalletCards,
  X,
} from "lucide-react";

type View = "citizen" | "operator" | "rewards" | "dashboard";

type Activity = {
  id: number;
  title: string;
  detail: string;
  date: string;
  points: number;
  kind: "collection" | "reward";
};

type Reward = {
  id: number;
  title: string;
  partner: string;
  description: string;
  cost: number;
  icon: LucideIcon;
  tone: string;
};

const materials = [
  { id: "pet", name: "Plástico / PET", rate: 12 },
  { id: "paper", name: "Papel e papelão", rate: 8 },
  { id: "glass", name: "Vidro", rate: 6 },
  { id: "metal", name: "Metais", rate: 20 },
  { id: "oil", name: "Óleo de cozinha", rate: 15 },
];

const rewards: Reward[] = [
  {
    id: 1,
    title: "Cesta de hortaliças",
    partner: "Feira do Produtor",
    description: "Seleção de produtos frescos de produtores locais.",
    cost: 400,
    icon: Sprout,
    tone: "mint",
  },
  {
    id: 2,
    title: "Vale-transporte",
    partner: "Mobilidade Apucarana",
    description: "Crédito demonstrativo para duas passagens urbanas.",
    cost: 300,
    icon: Bus,
    tone: "blue",
  },
  {
    id: 3,
    title: "R$ 10 em compras",
    partner: "Mercado Bom Vizinho",
    description: "Voucher de desconto em compras acima de R$ 40.",
    cost: 200,
    icon: ShoppingBag,
    tone: "sun",
  },
  {
    id: 4,
    title: "Kit de mudas",
    partner: "Viveiro Municipal",
    description: "Duas mudas nativas para cultivar em casa.",
    cost: 650,
    icon: Leaf,
    tone: "forest",
  },
];

const initialActivity: Activity[] = [
  {
    id: 1,
    title: "Entrega de plástico / PET",
    detail: "3,2 kg · Ponto Jardim Ponta Grossa",
    date: "12 ago, 14:32",
    points: 38,
    kind: "collection",
  },
  {
    id: 2,
    title: "Missão da semana concluída",
    detail: "Três semanas reciclando sem parar",
    date: "08 ago, 10:15",
    points: 20,
    kind: "collection",
  },
  {
    id: 3,
    title: "Voucher de feira resgatado",
    detail: "Feira do Produtor · Código RV-9831",
    date: "02 ago, 09:48",
    points: -200,
    kind: "reward",
  },
  {
    id: 4,
    title: "Entrega de papel e papelão",
    detail: "5,6 kg · Ponto Vila Nova",
    date: "29 jul, 16:20",
    points: 45,
    kind: "collection",
  },
];

const navigation: { id: View; label: string; shortLabel: string; icon: LucideIcon }[] = [
  { id: "citizen", label: "Área do cidadão", shortLabel: "Cidadão", icon: UserRound },
  { id: "operator", label: "Registrar coleta", shortLabel: "Coleta", icon: Recycle },
  { id: "rewards", label: "Recompensas", shortLabel: "Resgate", icon: Gift },
  { id: "dashboard", label: "Painel de impacto", shortLabel: "Painel", icon: BarChart3 },
];

const formatPoints = (value: number) => new Intl.NumberFormat("pt-BR").format(value);
const formatWeight = (value: number) =>
  new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value);

function QrPattern() {
  const cells = Array.from({ length: 225 }, (_, index) => {
    const row = Math.floor(index / 15);
    const column = index % 15;
    const inFinder = (top: number, left: number) => {
      const r = row - top;
      const c = column - left;
      if (r < 0 || r > 4 || c < 0 || c > 4) return false;
      return r === 0 || r === 4 || c === 0 || c === 4 || (r === 2 && c === 2);
    };
    const finder = inFinder(0, 0) || inFinder(0, 10) || inFinder(10, 0);
    const data = (row * 7 + column * 11 + row * column) % 9 < 4;
    return finder || data;
  });

  return (
    <div className="qr-pattern" role="img" aria-label="QR Code demonstrativo do cidadão">
      {cells.map((dark, index) => (
        <span key={index} className={dark ? "is-dark" : undefined} />
      ))}
    </div>
  );
}

export default function Home() {
  const [activeView, setActiveView] = useState<View>("citizen");
  const [menuOpen, setMenuOpen] = useState(false);
  const [balance, setBalance] = useState(1450);
  const [totalKg, setTotalKg] = useState(47.8);
  const [weeklyKg, setWeeklyKg] = useState(2.4);
  const [activity, setActivity] = useState<Activity[]>(initialActivity);
  const [operatorCode, setOperatorCode] = useState("ECO-APU-1024");
  const [userFound, setUserFound] = useState(true);
  const [searchMessage, setSearchMessage] = useState("");
  const [materialId, setMaterialId] = useState("pet");
  const [weight, setWeight] = useState("5");
  const [receipt, setReceipt] = useState<{ weight: number; material: string; points: number } | null>(null);
  const [pendingReward, setPendingReward] = useState<Reward | null>(null);
  const [toast, setToast] = useState("");
  const [dashboardKg, setDashboardKg] = useState(873.4);
  const [distributedPoints, setDistributedPoints] = useState(12480);
  const [redemptionCount, setRedemptionCount] = useState(23);
  const [materialVolumes, setMaterialVolumes] = useState<Record<string, number>>({
    pet: 312,
    paper: 226,
    glass: 148,
    metal: 116,
    oil: 71,
  });

  const selectedMaterial = materials.find((item) => item.id === materialId) ?? materials[0];
  const numericWeight = Number.parseFloat(weight.replace(",", ".")) || 0;
  const basePoints = Math.max(0, Math.round(numericWeight * selectedMaterial.rate));
  const missionBonus = weeklyKg < 3 && weeklyKg + numericWeight >= 3 ? 20 : 0;
  const previewPoints = basePoints + missionBonus;
  const missionProgress = Math.min(100, Math.round((weeklyKg / 3) * 100));
  const currentNav = navigation.find((item) => item.id === activeView) ?? navigation[0];

  const materialChart = useMemo(() => {
    const max = Math.max(...Object.values(materialVolumes));
    return materials.map((item) => ({
      ...item,
      volume: materialVolumes[item.id] ?? 0,
      percentage: Math.round(((materialVolumes[item.id] ?? 0) / max) * 100),
    }));
  }, [materialVolumes]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  }

  function changeView(view: View) {
    setActiveView(view);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function findCitizen() {
    const normalized = operatorCode.trim().toUpperCase();
    const found = normalized === "ECO-APU-1024" || normalized === "1024";
    setUserFound(found);
    setSearchMessage(found ? "Cidadão identificado com sucesso." : "Código não encontrado. Use ECO-APU-1024 na demonstração.");
  }

  function registerCollection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!userFound || numericWeight <= 0 || previewPoints <= 0) {
      notify("Confira o cidadão e informe um peso válido.");
      return;
    }

    const points = previewPoints;
    setBalance((current) => current + points);
    setTotalKg((current) => current + numericWeight);
    setWeeklyKg((current) => current + numericWeight);
    setDashboardKg((current) => current + numericWeight);
    setDistributedPoints((current) => current + points);
    setMaterialVolumes((current) => ({
      ...current,
      [selectedMaterial.id]: (current[selectedMaterial.id] ?? 0) + numericWeight,
    }));
    setActivity((current) => [
      {
        id: Date.now(),
        title: `Entrega de ${selectedMaterial.name.toLowerCase()}`,
        detail: `${formatWeight(numericWeight)} kg · Ecoponto Centro` + (missionBonus ? " · Missão +20" : ""),
        date: "Agora",
        points,
        kind: "collection",
      },
      ...current,
    ]);
    setReceipt({ weight: numericWeight, material: selectedMaterial.name, points });
    notify(`${formatPoints(points)} EcoPontos creditados na carteira.`);
  }

  function confirmRedemption() {
    if (!pendingReward || balance < pendingReward.cost) return;
    const reward = pendingReward;
    setBalance((current) => current - reward.cost);
    setRedemptionCount((current) => current + 1);
    setActivity((current) => [
      {
        id: Date.now(),
        title: `${reward.title} resgatado`,
        detail: `${reward.partner} · Código RV-${Math.floor(1000 + Math.random() * 8999)}`,
        date: "Agora",
        points: -reward.cost,
        kind: "reward",
      },
      ...current,
    ]);
    setPendingReward(null);
    notify("Resgate confirmado. O voucher já está no histórico.");
  }

  return (
    <main className="app-shell">
      <aside className={`sidebar ${menuOpen ? "is-open" : ""}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><Recycle size={23} aria-hidden="true" /></div>
          <div>
            <p className="brand-name">EcoApuca</p>
            <p className="brand-tagline">Recicle. Pontue. Transforme.</p>
          </div>
        </div>

        <button className="sidebar-close" type="button" onClick={() => setMenuOpen(false)} aria-label="Fechar menu">
          <X size={20} aria-hidden="true" />
        </button>

        <nav className="sidebar-nav" aria-label="Navegação principal">
          <p className="nav-caption">Demonstração</p>
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={activeView === item.id ? "nav-item is-active" : "nav-item"}
                onClick={() => changeView(item.id)}
                aria-current={activeView === item.id ? "page" : undefined}
              >
                <Icon size={19} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="pilot-card">
          <span className="live-dot" />
          <div>
            <strong>MVP demonstrativo</strong>
            <p>Fluxo completo com dados simulados para apresentação.</p>
          </div>
        </div>

        <div className="sidebar-profile">
          <div className="avatar">JV</div>
          <div>
            <strong>João da Silva</strong>
            <span>Jardim Ponta Grossa</span>
          </div>
        </div>
      </aside>

      {menuOpen ? <button className="mobile-scrim" onClick={() => setMenuOpen(false)} aria-label="Fechar menu" /> : null}

      <section className="app-main">
        <header className="topbar">
          <div className="mobile-brand">
            <button type="button" className="icon-button" onClick={() => setMenuOpen(true)} aria-label="Abrir menu">
              <Menu size={21} aria-hidden="true" />
            </button>
            <div className="mini-mark"><Recycle size={18} aria-hidden="true" /></div>
            <strong>EcoApuca</strong>
          </div>

          <div className="topbar-context">
            <span>Ambiente de demonstração</span>
            <strong>{currentNav.label}</strong>
          </div>

          <div className="topbar-actions">
            <span className="status-pill"><span /> Sistema operacional</span>
            <button className="icon-button" type="button" aria-label="Notificações">
              <Bell size={19} aria-hidden="true" />
              <i />
            </button>
            <div className="avatar small">JV</div>
          </div>
        </header>

        <div className="page-content">
          {activeView === "citizen" ? (
            <>
              <div className="page-heading">
                <div>
                  <p className="eyebrow">Área do cidadão</p>
                  <h1>Olá, João! Seu impacto está crescendo.</h1>
                  <p>Acompanhe seus EcoPontos, conclua desafios e troque seu esforço por benefícios locais.</p>
                </div>
                <button className="secondary-button" type="button" onClick={() => changeView("operator")}>
                  Simular nova coleta <ArrowRight size={17} aria-hidden="true" />
                </button>
              </div>

              <section className="citizen-hero">
                <article className="balance-card">
                  <div className="balance-topline">
                    <span><WalletCards size={18} aria-hidden="true" /> Carteira EcoPontos</span>
                    <span className="level-badge">Nível 3 · Guardião Verde</span>
                  </div>
                  <p className="balance-label">Saldo disponível</p>
                  <p className="balance-value">{formatPoints(balance)} <small>pts</small></p>
                  <div className="balance-progress">
                    <div><span style={{ width: "72%" }} /></div>
                    <p>550 pontos para chegar a Embaixador Ambiental</p>
                  </div>
                  <div className="balance-actions">
                    <button type="button" onClick={() => changeView("rewards")}>Usar meus pontos</button>
                    <span>+58 pts nos últimos 7 dias</span>
                  </div>
                </article>

                <article className="qr-card">
                  <div className="card-title-row">
                    <div>
                      <p className="eyebrow">Identificação</p>
                      <h2>Seu código verde</h2>
                    </div>
                    <QrCode size={22} aria-hidden="true" />
                  </div>
                  <div className="qr-content">
                    <QrPattern />
                    <div>
                      <span>Apresente na coleta</span>
                      <strong>ECO-APU-1024</strong>
                      <small>Funciona também no cartão impresso</small>
                    </div>
                  </div>
                </article>
              </section>

              <section className="metric-grid" aria-label="Resumo do cidadão">
                <article className="metric-card">
                  <div className="metric-icon green"><Scale size={20} aria-hidden="true" /></div>
                  <div><span>Total reciclado</span><strong>{formatWeight(totalKg)} kg</strong><small>+8,8 kg neste mês</small></div>
                </article>
                <article className="metric-card">
                  <div className="metric-icon blue"><Recycle size={20} aria-hidden="true" /></div>
                  <div><span>Entregas validadas</span><strong>{activity.filter((item) => item.kind === "collection").length + 9}</strong><small>Sequência de 3 semanas</small></div>
                </article>
                <article className="metric-card">
                  <div className="metric-icon yellow"><Trophy size={20} aria-hidden="true" /></div>
                  <div><span>Posição no bairro</span><strong>12º lugar</strong><small>Subiu 4 posições</small></div>
                </article>
              </section>

              <section className="content-grid citizen-grid">
                <article className="surface mission-card">
                  <div className="surface-heading">
                    <div><p className="eyebrow">Missão da semana</p><h2>Recicle pelo menos 3 kg</h2></div>
                    <span className="bonus-pill">+20 pts</span>
                  </div>
                  <div className="mission-visual">
                    <div className="mission-ring" style={{ "--progress": `${missionProgress * 3.6}deg` } as React.CSSProperties}>
                      <span>{Math.min(weeklyKg, 3).toFixed(1).replace(".", ",")}</span><small>de 3 kg</small>
                    </div>
                    <div>
                      <strong>{weeklyKg >= 3 ? "Missão concluída!" : `Faltam ${formatWeight(Math.max(0, 3 - weeklyKg))} kg`}</strong>
                      <p>{weeklyKg >= 3 ? "Seu bônus foi incluído na última coleta." : "Qualquer material reciclável conta para a meta."}</p>
                    </div>
                  </div>
                  <div className="neighborhood-progress">
                    <div className="progress-label"><span>Meta do Jardim Ponta Grossa</span><strong>82%</strong></div>
                    <div className="progress-track"><span style={{ width: "82%" }} /></div>
                    <p>4,1 de 5 toneladas para liberar o mutirão de plantio.</p>
                  </div>
                </article>

                <article className="surface">
                  <div className="surface-heading">
                    <div><p className="eyebrow">Últimas movimentações</p><h2>Histórico da carteira</h2></div>
                    <History size={20} aria-hidden="true" />
                  </div>
                  <div className="activity-list">
                    {activity.slice(0, 4).map((item) => (
                      <div className="activity-row" key={item.id}>
                        <div className={`activity-icon ${item.kind}`}>
                          {item.kind === "collection" ? <Recycle size={17} aria-hidden="true" /> : <Gift size={17} aria-hidden="true" />}
                        </div>
                        <div className="activity-copy"><strong>{item.title}</strong><span>{item.detail}</span><small>{item.date}</small></div>
                        <span className={item.points > 0 ? "points positive" : "points negative"}>{item.points > 0 ? "+" : ""}{item.points}</span>
                      </div>
                    ))}
                  </div>
                </article>
              </section>

              <section className="surface reward-preview">
                <div className="surface-heading">
                  <div><p className="eyebrow">Benefícios locais</p><h2>Recompensas em destaque</h2></div>
                  <button className="text-button" type="button" onClick={() => changeView("rewards")}>Ver todas <ArrowRight size={16} aria-hidden="true" /></button>
                </div>
                <div className="reward-mini-grid">
                  {rewards.slice(0, 3).map((reward) => {
                    const Icon = reward.icon;
                    return (
                      <article className="reward-mini" key={reward.id}>
                        <div className={`reward-art ${reward.tone}`}><Icon size={25} aria-hidden="true" /></div>
                        <div><small>{reward.partner}</small><strong>{reward.title}</strong><span>{formatPoints(reward.cost)} pts</span></div>
                      </article>
                    );
                  })}
                </div>
              </section>
            </>
          ) : null}

          {activeView === "operator" ? (
            <>
              <div className="page-heading">
                <div>
                  <p className="eyebrow">Operação no ecoponto</p>
                  <h1>Registrar entrega de recicláveis</h1>
                  <p>Identifique o cidadão, informe material e peso. Os pontos só nascem após a confirmação do operador.</p>
                </div>
                <span className="operator-chip"><span /> Operador Marina · Ecoponto Centro</span>
              </div>

              <div className="flow-steps" aria-label="Etapas do registro">
                <div className="is-done"><span><Check size={15} /></span><strong>1. Identificar</strong></div>
                <i />
                <div className="is-current"><span>2</span><strong>Material e peso</strong></div>
                <i />
                <div><span>3</span><strong>Confirmar pontos</strong></div>
              </div>

              <section className="operator-layout">
                <form className="surface operator-form" onSubmit={registerCollection}>
                  <div className="form-section">
                    <div className="form-section-title"><span>1</span><div><h2>Identifique o cidadão</h2><p>Leia o QR Code ou digite o código do cartão.</p></div></div>
                    <label className="field-label" htmlFor="citizen-code">Código do cidadão</label>
                    <div className="search-field">
                      <QrCode size={18} aria-hidden="true" />
                      <input id="citizen-code" value={operatorCode} onChange={(event) => setOperatorCode(event.target.value)} />
                      <button type="button" onClick={findCitizen}><Search size={17} aria-hidden="true" /> Buscar</button>
                    </div>
                    {searchMessage ? <p className={userFound ? "field-message success" : "field-message error"}>{searchMessage}</p> : null}
                    {userFound ? (
                      <div className="citizen-result">
                        <div className="avatar">JV</div>
                        <div><strong>João da Silva</strong><span>Jardim Ponta Grossa · Saldo: {formatPoints(balance)} pts</span></div>
                        <CheckCircle2 size={21} aria-label="Cidadão validado" />
                      </div>
                    ) : null}
                  </div>

                  <div className="form-divider" />

                  <div className="form-section">
                    <div className="form-section-title"><span>2</span><div><h2>Informe a pesagem</h2><p>Use o valor conferido na balança do ponto de coleta.</p></div></div>
                    <div className="form-grid">
                      <label className="form-field">
                        <span>Tipo de material</span>
                        <select value={materialId} onChange={(event) => setMaterialId(event.target.value)}>
                          {materials.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.rate} pts/kg</option>)}
                        </select>
                      </label>
                      <label className="form-field">
                        <span>Peso validado</span>
                        <div className="weight-input"><input type="number" min="0.1" step="0.1" value={weight} onChange={(event) => setWeight(event.target.value)} /><b>kg</b></div>
                      </label>
                    </div>
                  </div>

                  <div className="points-preview">
                    <div><span>Cálculo automático</span><strong>{formatWeight(numericWeight)} kg × {selectedMaterial.rate} pontos</strong></div>
                    <div className="calculation-result"><span>Crédito</span><strong>+{formatPoints(previewPoints)} pts</strong></div>
                  </div>
                  {missionBonus ? <p className="bonus-message"><Trophy size={16} aria-hidden="true" /> Inclui 20 pontos pela conclusão da missão semanal.</p> : null}

                  <button className="primary-button full" type="submit" disabled={!userFound || numericWeight <= 0}>
                    <CheckCircle2 size={18} aria-hidden="true" /> Confirmar pesagem e gerar pontos
                  </button>
                  <p className="security-note">Esta ação fica vinculada ao cidadão, operador, local, material, peso, data e horário.</p>
                </form>

                <aside className="operator-side">
                  {receipt ? (
                    <article className="surface receipt-card">
                      <div className="success-seal"><Check size={27} aria-hidden="true" /></div>
                      <p className="eyebrow">Transação aprovada</p>
                      <h2>Coleta registrada!</h2>
                      <p>Os EcoPontos já estão disponíveis na carteira de João.</p>
                      <div className="receipt-points">+{formatPoints(receipt.points)} <small>pts</small></div>
                      <dl>
                        <div><dt>Material</dt><dd>{receipt.material}</dd></div>
                        <div><dt>Peso</dt><dd>{formatWeight(receipt.weight)} kg</dd></div>
                        <div><dt>Transação</dt><dd>#COL-{String(Date.now()).slice(-5)}</dd></div>
                      </dl>
                      <button className="secondary-button full" type="button" onClick={() => changeView("citizen")}>Ver carteira atualizada <ArrowRight size={16} /></button>
                    </article>
                  ) : (
                    <article className="surface rule-card">
                      <div className="rule-icon"><Scale size={24} aria-hidden="true" /></div>
                      <p className="eyebrow">Regra de ouro</p>
                      <h2>Pontuação só após pesagem validada</h2>
                      <p>O cidadão nunca gera pontos sozinho. Cada transação registra quem pesou, onde, quando e qual material foi recebido.</p>
                      <ul>
                        <li><Check size={15} /> Reduz tentativas de fraude</li>
                        <li><Check size={15} /> Gera dados confiáveis</li>
                        <li><Check size={15} /> Mantém o atendimento simples</li>
                      </ul>
                    </article>
                  )}
                  <article className="surface quick-stats">
                    <div><span>Coletas hoje</span><strong>27</strong></div>
                    <div><span>Peso recebido</span><strong>{formatWeight(118.6 + Math.max(0, dashboardKg - 873.4))} kg</strong></div>
                    <div><span>Tempo médio</span><strong>1m 42s</strong></div>
                  </article>
                </aside>
              </section>
            </>
          ) : null}

          {activeView === "rewards" ? (
            <>
              <div className="page-heading">
                <div>
                  <p className="eyebrow">Economia local</p>
                  <h1>Troque EcoPontos por benefícios</h1>
                  <p>Recompensas simples de parceiros locais. No MVP, não há conversão direta dos pontos em dinheiro.</p>
                </div>
                <div className="compact-balance"><WalletCards size={19} /><span>Seu saldo</span><strong>{formatPoints(balance)} pts</strong></div>
              </div>

              <section className="reward-grid">
                {rewards.map((reward) => {
                  const Icon = reward.icon;
                  const available = balance >= reward.cost;
                  return (
                    <article className="reward-card surface" key={reward.id}>
                      <div className={`reward-hero ${reward.tone}`}><Icon size={35} aria-hidden="true" /><span>{reward.partner}</span></div>
                      <div className="reward-body">
                        <h2>{reward.title}</h2>
                        <p>{reward.description}</p>
                        <div className="reward-footer">
                          <strong>{formatPoints(reward.cost)} <small>EcoPontos</small></strong>
                          <button type="button" disabled={!available} onClick={() => setPendingReward(reward)}>{available ? "Resgatar" : "Saldo insuficiente"}</button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </section>

              <section className="surface redemption-explainer">
                <div><span>1</span><strong>Escolha</strong><p>Selecione uma recompensa disponível.</p></div>
                <i />
                <div><span>2</span><strong>Confirme</strong><p>Os pontos são debitados da carteira.</p></div>
                <i />
                <div><span>3</span><strong>Apresente</strong><p>Mostre o voucher ao parceiro local.</p></div>
              </section>
            </>
          ) : null}

          {activeView === "dashboard" ? (
            <>
              <div className="page-heading">
                <div>
                  <p className="eyebrow">Gestão ambiental</p>
                  <h1>Painel de impacto do piloto</h1>
                  <p>Indicadores para acompanhar adesão, volume, materiais, bairros e uso das recompensas.</p>
                </div>
                <span className="demo-data-pill"><LayoutDashboard size={16} /> Dados demonstrativos · Agosto 2026</span>
              </div>

              <section className="metric-grid dashboard-metrics">
                <article className="metric-card"><div className="metric-icon green"><Scale size={20} /></div><div><span>Recicláveis registrados</span><strong>{formatWeight(dashboardKg)} kg</strong><small className="up">↑ 18,4% no período</small></div></article>
                <article className="metric-card"><div className="metric-icon blue"><Users size={20} /></div><div><span>Participantes ativos</span><strong>86</strong><small>de 100 pessoas no piloto</small></div></article>
                <article className="metric-card"><div className="metric-icon yellow"><WalletCards size={20} /></div><div><span>Pontos distribuídos</span><strong>{formatPoints(distributedPoints)}</strong><small>100% por pesagem validada</small></div></article>
                <article className="metric-card"><div className="metric-icon coral"><Gift size={20} /></div><div><span>Resgates realizados</span><strong>{redemptionCount}</strong><small>6 parceiros participantes</small></div></article>
              </section>

              <section className="content-grid dashboard-grid">
                <article className="surface chart-card">
                  <div className="surface-heading"><div><p className="eyebrow">Evolução do piloto</p><h2>Quilos registrados por semana</h2></div><span className="chart-total">+18,4%</span></div>
                  <div className="bar-chart" role="img" aria-label="Gráfico semanal: 148, 186, 232 e 307 quilos">
                    {[{ label: "Sem 1", value: 148 }, { label: "Sem 2", value: 186 }, { label: "Sem 3", value: 232 }, { label: "Sem 4", value: 307 + Math.max(0, dashboardKg - 873.4) }].map((item) => (
                      <div className="bar-column" key={item.label}><span>{formatWeight(item.value)}</span><div style={{ height: `${Math.min(100, 28 + item.value / 4.2)}%` }} /><small>{item.label}</small></div>
                    ))}
                  </div>
                </article>

                <article className="surface material-card">
                  <div className="surface-heading"><div><p className="eyebrow">Composição</p><h2>Materiais recebidos</h2></div><Package size={20} /></div>
                  <div className="material-list">
                    {materialChart.map((item) => (
                      <div key={item.id}><div><span>{item.name}</span><strong>{formatWeight(item.volume)} kg</strong></div><div className="material-track"><span style={{ width: `${item.percentage}%` }} /></div></div>
                    ))}
                  </div>
                </article>
              </section>

              <section className="content-grid dashboard-lower">
                <article className="surface ranking-card">
                  <div className="surface-heading"><div><p className="eyebrow">Engajamento coletivo</p><h2>Ranking dos bairros</h2></div><Trophy size={20} /></div>
                  <div className="ranking-list">
                    {[
                      ["1", "Jardim Ponta Grossa", "214,8 kg", "+12%"],
                      ["2", "Vila Nova", "186,4 kg", "+8%"],
                      ["3", "João Paulo", "161,2 kg", "+16%"],
                      ["4", "Centro", "143,7 kg", "+5%"],
                    ].map((row) => <div key={row[0]}><span className="rank-number">{row[0]}</span><div><strong>{row[1]}</strong><small><MapPin size={12} /> Apucarana</small></div><b>{row[2]}</b><em>{row[3]}</em></div>)}
                  </div>
                </article>

                <article className="surface impact-card">
                  <div className="impact-illustration"><Leaf size={32} /></div>
                  <p className="eyebrow">Impacto estimado</p>
                  <h2>Reciclar também gera inteligência para a cidade.</h2>
                  <p>Os registros mostram onde a adesão cresce, quais materiais chegam e onde campanhas precisam ser reforçadas.</p>
                  <div className="impact-data"><div><strong>4,2 t</strong><span>CO₂ evitado*</span></div><div><strong>78%</strong><span>retornaram ao programa</span></div></div>
                  <small>*Estimativa demonstrativa para ilustrar o potencial do painel.</small>
                </article>
              </section>
            </>
          ) : null}
        </div>

        <nav className="mobile-nav" aria-label="Navegação móvel">
          {navigation.map((item) => {
            const Icon = item.icon;
            return <button key={item.id} type="button" className={activeView === item.id ? "is-active" : ""} onClick={() => changeView(item.id)}><Icon size={20} /><span>{item.shortLabel}</span></button>;
          })}
        </nav>
      </section>

      {pendingReward ? (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setPendingReward(null)}>
          <section className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setPendingReward(null)} aria-label="Fechar"><X size={19} /></button>
            <div className={`reward-art large ${pendingReward.tone}`}>{(() => { const Icon = pendingReward.icon; return <Icon size={30} />; })()}</div>
            <p className="eyebrow">Confirmar resgate</p>
            <h2 id="confirm-title">{pendingReward.title}</h2>
            <p>Você usará <strong>{formatPoints(pendingReward.cost)} EcoPontos</strong>. O voucher ficará disponível imediatamente no histórico.</p>
            <div className="modal-balance"><span>Saldo atual</span><strong>{formatPoints(balance)} pts</strong><i /><span>Novo saldo</span><strong>{formatPoints(balance - pendingReward.cost)} pts</strong></div>
            <button className="primary-button full" type="button" onClick={confirmRedemption}><Gift size={18} /> Confirmar e gerar voucher</button>
            <button className="link-button" type="button" onClick={() => setPendingReward(null)}>Cancelar</button>
          </section>
        </div>
      ) : null}

      <div className={toast ? "toast is-visible" : "toast"} role="status" aria-live="polite">
        <CheckCircle2 size={19} aria-hidden="true" /> {toast}
      </div>
    </main>
  );
}
