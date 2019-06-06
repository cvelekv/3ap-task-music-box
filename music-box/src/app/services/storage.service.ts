export class StorageService {
  setItemToStorage(key: string, value: any): void {
    localStorage.setItem(key, value.toString());
  }
  setObjToStorage(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItemFromStorage(key: string): any {
    return localStorage.getItem(key);
  }

}
