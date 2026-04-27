/**
 * Test 1: Utility funkce formatDate
 *
 * Proč testujeme utility funkce?
 * Jsou to "čisté" funkce — dostanou vstup, vrátí výstup, žádná databáze.
 * Díky tomu jsou nejjednodušší na testování a dávají rychlou zpětnou vazbu,
 * jestli se něco rozbilo.
 */
import { describe, it, expect } from "vitest";
import { formatDate } from "@/lib/format";

describe("formatDate", () => {
  // Kontrolujeme, že datum se správně převede do českého formátu
  it("formats a date in Czech locale (DD. MM. YYYY)", () => {
    const date = new Date("2026-04-26T12:00:00");
    const result = formatDate(date);

    // Český formát obsahuje den, měsíc a rok oddělené tečkami
    expect(result).toContain("26");
    expect(result).toContain("4");
    expect(result).toContain("2026");
  });
});
