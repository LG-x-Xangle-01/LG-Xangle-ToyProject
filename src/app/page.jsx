'use client';

import { useContext, useEffect, useState } from 'react';
import './globals.css';
import SignInButton from './components/SignInButton';
import { AppContext } from './layout';

export default function Home() {
  const { account, setAccount } = useContext(AppContext);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="mb-40"> 신뢰할 수 있는 이미지 오직 블루체크에서만</div>
      <SignInButton />
    </div>
  );
}
