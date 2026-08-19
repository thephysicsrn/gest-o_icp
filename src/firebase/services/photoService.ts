import { PhotoRecord } from '../../types';
import { STORAGE_KEYS, getFromStorage, saveToStorage } from './storageHelper';
import { INITIAL_PHOTOS } from '../seedData';

export const photoService = {
  getPhotosByGroup: async (groupId: string): Promise<PhotoRecord[]> => {
    const photos = getFromStorage<PhotoRecord[]>(STORAGE_KEYS.PHOTOS, INITIAL_PHOTOS);
    return photos
      .filter(p => p.groupId === groupId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  getPhotosByLine: async (lineId: string): Promise<PhotoRecord[]> => {
    const photos = getFromStorage<PhotoRecord[]>(STORAGE_KEYS.PHOTOS, INITIAL_PHOTOS);
    return photos
      .filter(p => p.lineId === lineId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  getPhotosByStudent: async (studentId: string): Promise<PhotoRecord[]> => {
    const photos = getFromStorage<PhotoRecord[]>(STORAGE_KEYS.PHOTOS, INITIAL_PHOTOS);
    return photos
      .filter(p => p.studentId === studentId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  createPhoto: async (photoData: {
    studentId: string;
    studentName: string;
    lineId: string;
    lineTitle: string;
    groupId: string;
    imageUrl: string;
    caption: string;
    date: string;
    stage: string;
    tags: string[];
  }): Promise<PhotoRecord> => {
    const photos = getFromStorage<PhotoRecord[]>(STORAGE_KEYS.PHOTOS, INITIAL_PHOTOS);

    const newPhoto: PhotoRecord = {
      id: `photo-${Date.now()}`,
      ...photoData,
      createdAt: new Date().toISOString()
    };

    photos.unshift(newPhoto);
    saveToStorage(STORAGE_KEYS.PHOTOS, photos);
    return newPhoto;
  },

  deletePhoto: async (photoId: string): Promise<void> => {
    let photos = getFromStorage<PhotoRecord[]>(STORAGE_KEYS.PHOTOS, INITIAL_PHOTOS);
    photos = photos.filter(p => p.id !== photoId);
    saveToStorage(STORAGE_KEYS.PHOTOS, photos);
  }
};
