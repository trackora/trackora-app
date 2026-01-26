import RNFS from 'react-native-fs';
 
export const createFolder = async (
  currentDirPath: string,
  folderName: string,
): Promise<unknown> => {
  const folderCreate = await RNFS.mkdir(`${currentDirPath}${folderName}`)
    .then(res => res)
    .catch(err => {
      if (err) {
        return err;
      }
      return undefined;
    });
  return folderCreate;
};
