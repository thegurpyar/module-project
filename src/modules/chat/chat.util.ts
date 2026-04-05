export const usersMap = new Map<string, Set<string>>();

export const addUserSocket = (userId: string, socketId: string) => {
  if (!usersMap.has(userId)) {
    usersMap.set(userId, new Set());
  }
  usersMap.get(userId)!.add(socketId);
};

export const removeUserSocket = (userId: string, socketId: string) => {
  const sockets = usersMap.get(userId);
  if (!sockets) return;

  sockets.delete(socketId);

  if (sockets.size === 0) {
    usersMap.delete(userId);
  }
};

export const getUserSocketIds = (userId: string): string[] => {
  return Array.from(usersMap.get(userId) || []);
};

export const isUserOnline = (userId: string): boolean => {
  return usersMap.has(userId);
};
