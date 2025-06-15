// src/shared/components/NewsSection.tsx
'use client';
import React from "react";

const NewsSection: React.FC = () => (
  <section style={{
    background: "#23272f",
    borderRadius: 16,
    boxShadow: "0 2px 12px #0004",
    padding: "32px 24px",
    margin: "2rem 0",
    width: "100%",
    maxWidth: 950
  }}>
    <h3 style={{ color: "#fcd34d", fontWeight: "bold", marginBottom: 20, fontSize: 22 }}>Notícias Recentes</h3>
    <ul style={{ paddingLeft: 0, listStyle: "none" }}>
      <li style={{
        color: "#fff",
        marginBottom: 14,
        background: "#18181b",
        borderRadius: 10,
        padding: "14px 18px",
        boxShadow: "0 1px 6px #0002"
      }}>
        <strong style={{ color: "#fcd34d" }}>Bitcoin atinge novo topo em 2025!</strong> — O mercado segue aquecido com alta demanda institucional.
      </li>
      <li style={{
        color: "#fff",
        marginBottom: 14,
        background: "#18181b",
        borderRadius: 10,
        padding: "14px 18px",
        boxShadow: "0 1px 6px #0002"
      }}>
        <strong style={{ color: "#fcd34d" }}>Ethereum lança atualização Shanghai</strong> — Prometendo taxas menores e mais escalabilidade.
      </li>
      <li style={{
        color: "#fff",
        marginBottom: 14,
        background: "#18181b",
        borderRadius: 10,
        padding: "14px 18px",
        boxShadow: "0 1px 6px #0002"
      }}>
        <strong style={{ color: "#fcd34d" }}>BNB Chain cresce em volume</strong> — Novos projetos DeFi impulsionam a rede.
      </li>
    </ul>
  </section>
);

export default NewsSection;