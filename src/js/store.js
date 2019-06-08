import {observable, runInAction, computed} from 'mobx';
import {isFileVideo, parseFile} from './mediainfo';

class Store {

  @observable file = null;
  @observable processing = false;
  @observable data = null;

  @computed get isVideo() {
    if (!this.data) return false;

    return isFileVideo(this.data);
  }

  setFile = async (file) => {
    runInAction(() => {
      this.data = null;
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
