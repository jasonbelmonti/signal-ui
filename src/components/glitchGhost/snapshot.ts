const focusableElementSelector = [
  "a[href]",
  "area[href]",
  "button",
  "input",
  "select",
  "textarea",
  "summary",
  "iframe",
  "audio[controls]",
  "video[controls]",
  "[tabindex]",
  "[contenteditable='']",
  "[contenteditable='true']",
].join(", ");

function sanitizeGhostElement(element: Element) {
  element.removeAttribute("id");
  element.removeAttribute("autofocus");
  element.setAttribute("aria-hidden", "true");
  element.setAttribute("inert", "");

  if (element instanceof HTMLElement) {
    element.inert = true;

    if (element.matches(focusableElementSelector)) {
      element.tabIndex = -1;
    }

    if (element.isContentEditable) {
      element.contentEditable = "false";
    }
  }

  if (
    element instanceof HTMLButtonElement ||
    element instanceof HTMLInputElement ||
    element instanceof HTMLSelectElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLOptGroupElement ||
    element instanceof HTMLOptionElement ||
    element instanceof HTMLFieldSetElement
  ) {
    element.disabled = true;
  }
}

function sanitizeGhostTree(rootNode: Node) {
  const queue: Node[] = [rootNode];

  while (queue.length > 0) {
    const node = queue.shift();

    if (!node) {
      continue;
    }

    if (node instanceof Element) {
      sanitizeGhostElement(node);
    }

    queue.push(...node.childNodes);
  }
}

function copyCanvasContents(sourceNode: Node, cloneNode: Node) {
  const queue: Array<[Node, Node]> = [[sourceNode, cloneNode]];

  while (queue.length > 0) {
    const pair = queue.shift();

    if (!pair) {
      continue;
    }

    const [sourceChild, cloneChild] = pair;

    if (sourceChild instanceof HTMLCanvasElement && cloneChild instanceof HTMLCanvasElement) {
      cloneChild.width = sourceChild.width;
      cloneChild.height = sourceChild.height;
      cloneChild.getContext("2d")?.drawImage(sourceChild, 0, 0);
    }

    const sourceDescendants = Array.from(sourceChild.childNodes);
    const cloneDescendants = Array.from(cloneChild.childNodes);
    const childCount = Math.min(sourceDescendants.length, cloneDescendants.length);

    for (let index = 0; index < childCount; index += 1) {
      const sourceDescendant = sourceDescendants[index];
      const cloneDescendant = cloneDescendants[index];

      if (!sourceDescendant || !cloneDescendant) {
        continue;
      }

      queue.push([sourceDescendant, cloneDescendant]);
    }
  }
}

function cloneGhostNode(sourceNode: Node) {
  const cloneNode = sourceNode.cloneNode(true);

  copyCanvasContents(sourceNode, cloneNode);
  sanitizeGhostTree(cloneNode);

  return cloneNode;
}

export function syncGhostSnapshotLayers(
  sourceElement: HTMLElement,
  targetElements: HTMLDivElement[],
) {
  const baseClones = Array.from(sourceElement.childNodes, (node) => cloneGhostNode(node));

  for (const targetElement of targetElements) {
    targetElement.replaceChildren(...baseClones.map((node) => node.cloneNode(true)));
  }
}
