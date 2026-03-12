import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { GlitchGhost } from "./GlitchGhost.js";

describe("GlitchGhost", () => {
  test("renders the live subtree only once when ghost content is not provided", () => {
    const markup = renderToStaticMarkup(
      <GlitchGhost>
        <button type="button">Arm relay</button>
      </GlitchGhost>,
    );

    expect(markup.match(/>Arm relay<\/button>/g) ?? []).toHaveLength(1);
    expect(markup.match(/\sinert(?:="")?/g) ?? []).toHaveLength(3);
  });

  test("renders explicit ghost content into each ghost layer", () => {
    const markup = renderToStaticMarkup(
      <GlitchGhost ghost={<span>Echo shell</span>} ghostCount={2}>
        <span>Live shell</span>
      </GlitchGhost>,
    );

    expect(markup.match(/>Echo shell<\/span>/g) ?? []).toHaveLength(2);
    expect(markup.match(/>Live shell<\/span>/g) ?? []).toHaveLength(1);
  });
});
