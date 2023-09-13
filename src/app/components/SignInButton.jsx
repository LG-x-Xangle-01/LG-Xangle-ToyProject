//app/components/SignInButton.tsx

'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import React, { useContext, useEffect } from 'react';
import { AppContext } from '../layout';
import { useRouter } from 'next/navigation';

import axios from 'axios';

function SignInButton() {
  const { data: session } = useSession();
  const { account, setAccount, web3 } = useContext(AppContext);
  const router = useRouter();

  const make_user = async (suser) => {
    const newAccount = web3.eth.accounts.create();

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/user`,
        {
          auth: suser.id,
          pvk: newAccount.privateKey,
          nickname: 'test',
          login_type: 'test',
        }
      );

      setAccount({
        name: suser.name,
        id: suser.id,
        pvk: res.data.user.address,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const go_Register = () => {
    make_user(session.user);
    router.push('/register');
  };

  const go_Check = () => {
    make_user(session.user);
    router.push('/check');
  };

  if (session && session.user) {
    // console.log(session.user.id);

    return (
      <div className="flex flex-col">
        <button
          className="px-12 py-4 border rounded-xl bg-red-300"
          onClick={() => signOut()}
        >
          {session.user.name}님 Log Out
        </button>

        <button
          className="px-8 py-2 border rounded-xl bg-red-200"
          onClick={go_Register}
        >
          원본 등록
        </button>
        <button
          className="px-8 py-2 border rounded-xl bg-red-200"
          onClick={go_Check}
        >
          원본 검증
        </button>
      </div>
    );
  }

  return (
    <button
      className="px-12 py-4 border rounded-xl bg-yellow-300"
      onClick={() => signIn()}
    >
      LogIn
    </button>
  );
}

export default SignInButton;
