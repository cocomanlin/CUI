export function mergeClassName(target, coreClass) {
  if (!target || !coreClass) return;
  target.className = [coreClass, target.className].filter(Boolean).join(" ");
}

export function mergeStyle(target, coreStyle) {
  if (!target || !coreStyle) return;
  target.style = { ...target.style, ...coreStyle };
}
