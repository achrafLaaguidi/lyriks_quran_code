import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector'
import backend from 'i18next-http-backend'

i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(backend)
    .init({
        debug: true,
        fallbackLng: ['ar', 'eng', 'fr'],
        backend: {
            // Path where your locales are stored
            loadPath: '/locales/{{lng}}/translation.json',
        },

    })