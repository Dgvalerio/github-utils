export const awaiter = (timeout: number = 2048): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, timeout));
