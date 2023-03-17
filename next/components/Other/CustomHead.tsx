import Head from 'next/head';
import React from 'react';

const CustomHead: React.FC = () => {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};
export default CustomHead;
