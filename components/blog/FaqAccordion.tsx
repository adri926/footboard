"use client"

import { useState } from "react"
import type { FaqCategory } from "@/lib/faq"

export default function FaqAccordion({ categories }: { categories: FaqCategory[] }) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      {categories.map(cat => (
        <section key={cat.title}>
          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
            color: "var(--sauge)", textTransform: "uppercase",
            marginBottom: 12,
          }}>
            {cat.title}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {cat.items.map(item => {
              const key = `${cat.title}-${item.question}`
              const isOpen = open === key
              return (
                <div key={key} style={{
                  backgroundColor: "var(--bg-card)",
                  border: `1px solid ${isOpen ? "rgba(122,154,130,0.25)" : "rgba(122,154,130,0.08)"}`,
                  borderRadius: 10,
                  overflow: "hidden",
                  transition: "border-color 0.2s",
                }}>
                  <button
                    onClick={() => setOpen(isOpen ? null : key)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center",
                      justifyContent: "space-between", gap: 16,
                      padding: "16px 20px", cursor: "pointer",
                      background: "none", border: "none", textAlign: "left",
                    }}
                  >
                    <span style={{
                      fontFamily: "var(--font-body), sans-serif",
                      fontWeight: 500, fontSize: 14,
                      color: isOpen ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.75)",
                      lineHeight: 1.4,
                    }}>
                      {item.question}
                    </span>
                    <span style={{
                      flexShrink: 0,
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 14,
                      color: "rgba(122,154,130,0.6)",
                      transform: isOpen ? "rotate(45deg)" : "none",
                      transition: "transform 0.2s",
                      lineHeight: 1,
                    }}>
                      +
                    </span>
                  </button>

                  {isOpen && (
                    <div style={{
                      padding: "0 20px 18px",
                      borderTop: "1px solid rgba(122,154,130,0.08)",
                    }}>
                      <p style={{
                        fontFamily: "var(--font-body), sans-serif",
                        fontWeight: 400, fontSize: 13.5, lineHeight: 1.7,
                        color: "rgba(255,255,255,0.5)",
                        paddingTop: 14,
                      }}>
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
