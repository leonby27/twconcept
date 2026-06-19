import type { CSSProperties } from "react";

// Инфраструктура: тёмная плашка-«серверная» с обещанием аптайма
// и четырьмя фактами о ЦОД внизу.
const POINTS = [
  { icon: "buildings", text: "Собственные дата-центры в\u00A0РФ и\u00A0Европе" },
  { icon: "arrows-clockwise", text: "Резервирование уровня Tier\u00A0III" },
  { icon: "shield-check", text: "Защита от\u00A0DDoS на\u00A0уровне сети" },
  { icon: "database", text: "NVMe-диски и\u00A0сеть с\u00A0запасом" },
];

export default function Infrastructure() {
  return (
    <section className="infra">
      <div className="container">
        <div className="infra__card" data-media="datacenter-bg">
          <h2 className="infra__heading">Инфраструктура</h2>
          <p className="infra__desc">
            Серверы под защитой и резервированием&nbsp;— вы платите за хостинг, а не за простои
          </p>

          <ul className="infra__grid">
            {POINTS.map((p) => (
              <li key={p.icon} className="infra__cell">
                <span
                  className="icon infra__cell-icon"
                  aria-hidden="true"
                  style={{ "--icon": `url(/assets/icons/duotone/${p.icon}.svg)` } as CSSProperties}
                />
                <p className="infra__cell-text">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
