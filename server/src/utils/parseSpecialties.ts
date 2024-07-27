export function parseSpecialties(specialties: any) {
  return String(specialties)
    .split(',')
    .map((specialty) => specialty.trim());
}
