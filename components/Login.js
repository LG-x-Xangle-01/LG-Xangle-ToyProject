import {useEffect, useState} from "react";
import Image from "next/image";
import { signIn, signOut, useSession } from 'next-auth/react';

import styles from '@/styles/Login.module.css';
import axios from 'axios';

const CloseBtn = ({ setLoginBoxOpen }) => {
  const onClickHandler = () => setLoginBoxOpen(false);

  return (
    <>
      <div className={styles.closeBtnDiv}>
        <Image src='/Close.svg' width={22} height={22} alt='close' onClick={onClickHandler} />
      </div>
    </>
  )
}

const SnsLogoBtn = ({sns, color}) => {
  const divStyle = {background: color}

  const onClickHandler = () => {
    if (sns === 'naver') signIn('naver');
  }

  return (
    <>
      <div className={styles.snsBtnDiv} style={divStyle} onClick={onClickHandler}>
        <Image src={`/sns/${sns}.svg`} width={24} height={24} alt={sns} />
      </div>
    </>
  )
}

const LoginBox = ({ loginBoxOpen, setLoginBoxOpen }) => {
  const snsList = ['naver', 'kakao', 'google'];
  const colors = ['#4DB743', '#FCE73D', '#e5e5e5']

  const { data: session, status } = useSession()

  const addUserDataIfNotExist = async () => {
    const inputParams = { nickname: session.user.name, accessToken: session.accessToken }
    await axios.post('http://localhost:3000/api/addUser', inputParams)
  }

  useEffect(() => {
    if (status !== 'authenticated') return;

    addUserDataIfNotExist().then(r => r);
  }, [status]);

  if (loginBoxOpen) {
    return (
      <>
        <div className={styles.loginBoxWrapperDiv}>
          <div className={styles.loginBoxDiv}>
            <CloseBtn setLoginBoxOpen={setLoginBoxOpen} />

            <p>로그인</p>

            <div className={styles.snsBtnWrapperDiv}>
              {snsList.map((sns, snsIdx) => {
                return <SnsLogoBtn sns={sns} color={colors[snsIdx]} key={snsIdx} />
              })}
            </div>
          </div>
        </div>
      </>
    )
  }

  return <></>;
}

const Logout = () => {
  const { data: session, status } = useSession();

  if (status === 'authenticated') {
    return <button onClick={() => signOut()}>로그아웃</button>;
  }

  return <></>;
}

const Login = () => {
  const [loginBoxOpen, setLoginBoxOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <>
      <button onClick={() => setLoginBoxOpen(true)}>로그인</button>
      <Logout />
      <LoginBox loginBoxOpen={loginBoxOpen} setLoginBoxOpen={setLoginBoxOpen} />
      {status === 'authenticated' && (<p>Hello, {session.user.name}</p>)}
    </>
  )
}

export default Login;