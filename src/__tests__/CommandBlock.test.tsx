/**
 * Test 2: Komponenta CommandBlock
 *
 * Proč testujeme renderování komponenty?
 * Chceme ověřit, že se komponenta zobrazí správně — že texty, které
 * uživatel má vidět, se opravdu vykreslí. Pokud někdo omylem smaže
 * kus JSX, test to odhalí.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CommandBlock from "@/components/CommandBlock";

describe("CommandBlock", () => {
  // Kontrolujeme, že se všechny předané příkazy zobrazí na obrazovce
  it("renders all commands passed as props", () => {
    const commands = [
      "git clone https://example.com/repo.git",
      "cd repo",
      "npm install",
    ];

    render(<CommandBlock commands={commands} />);

    // Každý příkaz by měl být vidět v renderovaném výstupu
    for (const cmd of commands) {
      expect(screen.getByText(cmd)).toBeInTheDocument();
    }
  });
});
