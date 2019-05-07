import {observable, runInAction} from 'mobx';
import {parseFile} from './mediainfo';

class Store {

  @observable file = null;
  @observable processing = false;
  @observable data = null;

  setFile = async (file) => {
    runInAction(() => {
      this.file = file;
      this.processing = true;
    });

    const data = await parseFile(file);

    runInAction(() => {
      this.data = data;
      this.processing = false;
    })
  }
}

export const FileStore = new Store();
