/**
 * Utility functions for generating standardized Bulolo Connect reference numbers
 */

export function generateAccountId(sequence: number): string {
  const padded = String(sequence).padStart(4, '0');
  const year = new Date().getFullYear();
  return `BC-USR-${year}-${padded}`;
}

export function generateRequestReference(sequence: number): string {
  const padded = String(sequence).padStart(5, '0');
  const year = new Date().getFullYear();
  return `REQ-${year}-${padded}`;
}

export function generateApplicationNumber(sequence: number): string {
  const padded = String(sequence).padStart(4, '0');
  const year = new Date().getFullYear();
  return `AST-${year}-${padded}`;
}

export function generateHouseholdReference(sequence: number): string {
  const padded = String(sequence).padStart(4, '0');
  const year = new Date().getFullYear();
  return `HHD-${year}-${padded}`;
}

export function generateProjectCode(sequence: number): string {
  const padded = String(sequence).padStart(3, '0');
  const year = new Date().getFullYear();
  return `BDP-${year}-${padded}`;
}
