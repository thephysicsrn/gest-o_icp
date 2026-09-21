/**
 * Utilitário de sanitização para o Firestore.
 * Remove recursivamente propriedades com valor `undefined` de objetos e arrays,
 * evitando o erro "Unsupported field value: undefined" do SDK do Firebase Firestore.
 */
export function sanitizeFirestoreData<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => sanitizeFirestoreData(item)) as unknown as T;
  }

  if (typeof data === 'object') {
    // Preserva objetos especiais como Timestamp, FieldValue, Date, etc.
    if (
      data instanceof Date ||
      ('nanoseconds' in data && 'seconds' in data) ||
      ('_methodName' in (data as Record<string, any>)) ||
      (data.constructor && (data.constructor.name === 'FieldValue' || data.constructor.name === 'DeleteTransform' || data.constructor.name === 'ServerTimestampTransform'))
    ) {
      return data;
    }

    const clean: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        clean[key] = sanitizeFirestoreData(value);
      }
    }
    return clean as T;
  }

  return data;
}
