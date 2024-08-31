import React from 'react';

import { loader } from '../assets';
import { t } from 'i18next';

const Loader = () => (
  <div className="w-full flex justify-center items-center flex-col">
    <img src={loader} alt="loader" className="w-32 h-32 object-contain" />
    <h1 className="font-bold text-2xl text-white mt-2">{t('Loading')}</h1>
  </div>
);

export default Loader;