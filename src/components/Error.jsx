import { t } from 'i18next';
import React from 'react';
import { HiRefresh } from 'react-icons/hi';

const Error = () => (
  <div className="w-full h-full flex flex-col content-center flex-wrap items-center justify-center">
    <h1 className="font-bold md:text-2xl text-lg text-white">{t('Error')}</h1>
    <div className='bg-white rounded-full text-4xl mt-4 p-2' onClick={() => window.location.reload()}>
      <HiRefresh />
    </div>
  </div>
);

export default Error;