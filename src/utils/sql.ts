export const buildUpdate = (
  data: Record<string, unknown>,
  allowedFields: string[]
): { fields: string[]; values: unknown[] } => {
  const fields: string[] = [];
  const values: unknown[] = [];

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      fields.push(`${field} = ?`);
      values.push(data[field]);
    }
  }

  return { fields, values };
};
