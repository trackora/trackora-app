import RNFS from 'react-native-fs';

export const createFolder = async (currentDirPath, folderName) => {
  const folderCreate = await RNFS.mkdir(currentDirPath + folderName)
    .then(res => {
      // console.log("createFolder", res)
      return res;
    })
    .catch(err => {
      if (err) {
        return err;
      }
    });
  return folderCreate;
};
