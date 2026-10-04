import { describe, expect, it, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { getDict } from "@/i18n/dictionaries";

/**
 * Repertorio y el embed de Spotify, añadidos a partir de un set list real que Manuel
 * pasó (playlist de versiones karaoke usadas como referencia de arreglo) — limpiado a
 * mano a título + artista, sin "(Karaoke Version)" ni el canal. Los dos viven en
 * site.ts, no en dictionaries.ts, así que hace falta mockear @/config/site para probar
 * los casos vacíos — mismo patrón que cloudflare-analytics.test.tsx.
 */
describe("Media — repertorio y Spotify", () => {
  afterEach(() => {
    cleanup();
    vi.resetModules();
    vi.doUnmock("@/config/site");
  });

  it("con el repertorio real de site.ts, pinta título, artista y nada de 'Karaoke'", async () => {
    const { Media } = await import("@/components/Sections");
    const { container, getByText } = render(<Media dict={getDict("es")} />);

    // Primera y última canción de la lista real, como centinelas de que el array llegó.
    expect(getByText("All of Me")).toBeInTheDocument();
    expect(getByText("· John Legend")).toBeInTheDocument();
    expect(getByText("La Vie en Rose")).toBeInTheDocument();

    // Lo que NO debe quedar: el ruido del set list original.
    expect(container.textContent).not.toMatch(/karaoke/i);
    expect(container.textContent).not.toContain("Sing King");
  });

  it("sin spotifyEmbed (estado real hoy), no renderiza ningún iframe de Spotify", async () => {
    const { Media } = await import("@/components/Sections");
    const { container } = render(<Media dict={getDict("es")} />);
    expect(container.querySelector('iframe[title="Spotify"]')).toBeNull();
  });

  it("con spotifyEmbed, renderiza el iframe con esa URL exacta", async () => {
    vi.doMock("@/config/site", () => ({
      site: {
        media: {
          youtubeIds: ["", "", ""],
          spotifyEmbed: "https://open.spotify.com/embed/track/TEST123",
          repertoire: [],
        },
      },
    }));
    const { Media } = await import("@/components/Sections");
    const { container } = render(<Media dict={getDict("es")} />);

    const iframe = container.querySelector('iframe[title="Spotify"]');
    expect(iframe).not.toBeNull();
    expect(iframe).toHaveAttribute("src", "https://open.spotify.com/embed/track/TEST123");
  });

  it("con repertoire vacío, la sección de repertorio no se renderiza", async () => {
    vi.doMock("@/config/site", () => ({
      site: { media: { youtubeIds: ["", "", ""], spotifyEmbed: "", repertoire: [] } },
    }));
    const { Media } = await import("@/components/Sections");
    const dict = getDict("es");
    const { queryByText } = render(<Media dict={dict} />);
    expect(queryByText(dict.media.repertoireTitle)).toBeNull();
  });
});
