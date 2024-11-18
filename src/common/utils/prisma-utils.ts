export const mapToSearch = <T>(where: T, excludedValues: string[] = []): T => {
  return Object.entries(where).reduce((acc, [key, value]) => {
    if (typeof value === 'string' && !excludedValues.includes(value)) {
      acc[key] = { contains: value.toLowerCase(), mode: 'insensitive' };
    } else {
      acc[key] = value;
    }
    return acc;
  }, {} as T);
};
