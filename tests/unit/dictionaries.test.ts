import { describe, expect, it } from "vitest";
import { getDict, locales, defaultLocale } from "@/i18n/dictionaries";

describe("dictionaries", () => {
  it("sirve un diccionario por cada locale declarado", () => {
    for (const locale of locales) {
      expect(getDict(locale)).toBeTypeOf("object");
    }
  });

  it("el locale por defecto es español", () => {
    expect(defaultLocale).toBe("es");
    expect(getDict("es").testimonials.eyebrow).toBe("Opiniones");
  });

  it("ES y EN tienen la misma estructura de claves de primer nivel", () => {
    const es = Object.keys(getDict("es")).sort();
    const en = Object.keys(getDict("en")).sort();
    expect(en).toEqual(es);
  });

  it("ningún texto de primer nivel queda vacío", () => {
    for (const locale of locales) {
      const dict = getDict(locale) as Record<string, unknown>;
      for (const [key, value] of Object.entries(dict)) {
        expect(value, `${locale}.${key} está vacío`).toBeTruthy();
      }
    }
  });
});
