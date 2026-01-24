import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './src/locales/en.json';
import hi from './src/locales/hindi.json';
import gu from './src/locales/gujarati.json';
import ma from './src/locales/marathi.json'

export const languageResources = {
en: {translation: en},
hi: {translation: hi},
gu: {translation: gu},
mr: {translation: ma},
};

i18next.use(initReactI18next).init({
compatibilityJSON: 'v3',
lng: 'en',
fallbackLng: 'en',
resources: languageResources,
});

export default i18next;