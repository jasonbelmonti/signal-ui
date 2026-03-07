import type { ThemeConfig } from "antd";

type ThemeComponents = NonNullable<ThemeConfig["components"]>;

function mergeThemeComponents(
  base: ThemeComponents | undefined,
  overrides: ThemeComponents | undefined,
) {
  if (!base) {
    return overrides;
  }

  if (!overrides) {
    return base;
  }

  const baseComponents = base as Record<string, object | undefined>;
  const overrideComponents = overrides as Record<string, object | undefined>;
  const mergedComponents = { ...baseComponents };

  for (const componentName of Object.keys(overrideComponents)) {
    const baseComponent = baseComponents[componentName];
    const overrideComponent = overrideComponents[componentName];

    if (baseComponent && overrideComponent) {
      mergedComponents[componentName] = {
        ...baseComponent,
        ...overrideComponent,
      };
      continue;
    }

    mergedComponents[componentName] = overrideComponent;
  }

  return mergedComponents as ThemeComponents;
}

export function mergeThemeConfig(base: ThemeConfig, overrides: ThemeConfig): ThemeConfig {
  const token =
    base.token || overrides.token ? { ...base.token, ...overrides.token } : undefined;
  const components = mergeThemeComponents(base.components, overrides.components);

  return {
    ...base,
    ...overrides,
    ...(token ? { token } : {}),
    ...(components ? { components } : {}),
  };
}
