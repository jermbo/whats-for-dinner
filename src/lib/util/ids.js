// Each record has a unique ID and a "last changed" time, so that sync is possible later.

export const newId = () => crypto.randomUUID();

export const now = () => new Date().toISOString();
