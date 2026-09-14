export function getServerSideError(
  message: string,
  statusCode = 400
): { error: string; message: string; statusCode: number } {
  return { error: "Error", message, statusCode };
}

export function isServerComponent(): boolean {
  return typeof window === "undefined";
}

export function getSessionTimeout(): number {
  return parseInt(process.env.SESSION_TIMEOUT ?? "30", 10) * 60 * 1000;
}

export function validateCaseNumber(caseNumber: string): boolean {
  return /^[A-Z]{3}-\d{4}-\d{5}$/.test(caseNumber);
}

export function getPaginationParams(
  page: number | string,
  limit: number | string
): { page: number; limit: number; skip: number } {
  const p = typeof page === "number" ? page : parseInt(page as string, 10) || 1;
  const l = typeof limit === "number" ? limit : parseInt(limit as string, 10) || 10;
  return {
    page: Math.max(1, p),
    limit: Math.min(100, Math.max(1, l)),
    skip: (Math.max(1, p) - 1) * Math.min(100, Math.max(1, l)),
  };
}
