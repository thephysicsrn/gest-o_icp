import { LineResource, ResourceType } from '../../types';
import { STORAGE_KEYS, getFromStorage, saveToStorage } from './storageHelper';
import { INITIAL_RESOURCES } from '../seedData';

export const resourceService = {
  getResourcesByLine: async (lineId: string): Promise<LineResource[]> => {
    const resources = getFromStorage<LineResource[]>(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
    return resources
      .filter(r => r.lineId === lineId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getAllResourcesByGroup: async (groupId: string): Promise<LineResource[]> => {
    const resources = getFromStorage<LineResource[]>(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
    return resources
      .filter(r => r.groupId === groupId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createResource: async (resourceData: {
    groupId: string;
    lineId: string;
    lineTitle?: string;
    type: ResourceType;
    title: string;
    url: string;
    fileName?: string;
    fileSize?: string;
    fileType?: string;
    description?: string;
    uploadedBy: string;
    uploadedByName: string;
  }): Promise<LineResource> => {
    const resources = getFromStorage<LineResource[]>(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);

    const newResource: LineResource = {
      id: `res-${Date.now()}`,
      groupId: resourceData.groupId,
      lineId: resourceData.lineId,
      lineTitle: resourceData.lineTitle,
      type: resourceData.type,
      title: resourceData.title,
      url: resourceData.url,
      fileName: resourceData.fileName,
      fileSize: resourceData.fileSize,
      fileType: resourceData.fileType,
      description: resourceData.description,
      uploadedBy: resourceData.uploadedBy,
      uploadedByName: resourceData.uploadedByName,
      createdAt: new Date().toISOString()
    };

    resources.unshift(newResource);
    saveToStorage(STORAGE_KEYS.RESOURCES, resources);
    return newResource;
  },

  deleteResource: async (resourceId: string): Promise<void> => {
    let resources = getFromStorage<LineResource[]>(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
    resources = resources.filter(r => r.id !== resourceId);
    saveToStorage(STORAGE_KEYS.RESOURCES, resources);
  }
};
