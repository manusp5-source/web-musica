import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Testing Library no limpia sola con globals: true en Vitest
afterEach(() => {
  cleanup();
});
