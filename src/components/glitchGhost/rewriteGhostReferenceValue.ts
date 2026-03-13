const tokenReferenceAttributes = new Set([
  "aria-activedescendant",
  "aria-controls",
  "aria-describedby",
  "aria-details",
  "aria-errormessage",
  "aria-flowto",
  "aria-labelledby",
  "aria-owns",
  "for",
  "form",
  "headers",
  "list",
]);

const directReferenceAttributes = new Set(["href", "xlink:href"]);

export function rewriteGhostReferenceValue(
  attributeName: string,
  attributeValue: string,
  idMap: ReadonlyMap<string, string>,
) {
  let nextValue = attributeValue.replaceAll(
    /url\(\s*(['"])?#([^)'" ]+)\1\s*\)/g,
    (match, quote, id) => {
      const rewrittenId = idMap.get(id);

      if (!rewrittenId) {
        return match;
      }

      const quotePrefix = typeof quote === "string" ? quote : "";

      return `url(${quotePrefix}#${rewrittenId}${quotePrefix})`;
    },
  );

  if (directReferenceAttributes.has(attributeName) && nextValue.startsWith("#")) {
    const rewrittenId = idMap.get(nextValue.slice(1));

    if (rewrittenId) {
      nextValue = `#${rewrittenId}`;
    }
  }

  if (tokenReferenceAttributes.has(attributeName)) {
    nextValue = nextValue
      .split(/\s+/)
      .filter((token) => token.length > 0)
      .map((token) => idMap.get(token) ?? token)
      .join(" ");
  }

  return nextValue;
}
