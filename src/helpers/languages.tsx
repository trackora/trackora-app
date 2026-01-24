import i18next from 'i18next';
import { storeData } from './localStorage';
import { store } from '../redux/store';
import { setLanguage } from '../redux/slices/user.slice';

export const availableLanguages = [
  { title: 'English', code: 'en' },
  { title: 'Hindi', code: 'hi' },
  { title: 'Gujarati', code: 'gu' },
  { title: 'Marathi', code: 'mr' },
];

export const changeLanguage = async lang => {
  store?.dispatch(setLanguage(lang));
  await storeData(`current_language`, lang);
  i18next.changeLanguage(lang);
  // setOpenModal(false)
};
