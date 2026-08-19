/**
 * storageHelper.ts
 * 
 * Este arquivo era responsável pela camada de dados local (localStorage).
 * Após a migração para Firebase Auth + Firestore, ele não é mais necessário.
 * 
 * Mantido por compatibilidade.
 */

export const initLocalStorage = (): void => {};

export const getStorageUsers = async (): Promise<any[]> => [];

export const resetDataToSeed = (): void => {
  console.info('Os dados estão sincronizados em tempo real com o Cloud Firestore do Firebase.');
};
