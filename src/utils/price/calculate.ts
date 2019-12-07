export function calculateName(name: string) {
  return name.replace(/"/g, '');
}

export function calculateDescription(desc: string) {
  const maxDescriptionLength = 2500;
  return desc.replace(/\//g, '|').slice(0, maxDescriptionLength);
}
