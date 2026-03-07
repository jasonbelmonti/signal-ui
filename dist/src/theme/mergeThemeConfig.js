function mergeThemeComponents(base, overrides) {
    if (!base) {
        return overrides;
    }
    if (!overrides) {
        return base;
    }
    const baseComponents = base;
    const overrideComponents = overrides;
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
    return mergedComponents;
}
export function mergeThemeConfig(base, overrides) {
    const token = base.token || overrides.token ? { ...base.token, ...overrides.token } : undefined;
    const components = mergeThemeComponents(base.components, overrides.components);
    return {
        ...base,
        ...overrides,
        ...(token ? { token } : {}),
        ...(components ? { components } : {}),
    };
}
