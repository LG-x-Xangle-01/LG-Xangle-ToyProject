//app/components/SignInButton.tsx

"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import React, { useContext, useEffect } from "react";
import { AppContext } from "../layout";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import axios from "axios";

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
          nickname: "test",
          login_type: "test",
        }
      );

      setAccount({
        name: suser.name,
        id: res.data.user.id,
        pvk: res.data.user.address,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const go_Register = () => {
    make_user(session.user);
    router.push("/register");
  };

  const go_Check = () => {
    make_user(session.user);
    router.push("/check");
  };

  const go_History = () => {
    make_user(session.user);
    router.push("/history");
  };

  if (session && session.user) {
    // console.log(session.user.id);

    return (
      <div className="flex flex-col" style={{ marginTop: "20px" }}>
        <BlackShortButton
          onClick={() => signOut()}
          style={{ marginBottom: "10px" }}
        >
          {session.user.name}님 Log Out
        </BlackShortButton>

        <BlackShortButton
          onClick={go_Register}
          style={{ marginBottom: "10px" }}
        >
          원본 등록
        </BlackShortButton>
        <BlackShortButton onClick={go_Check}>원본 검증</BlackShortButton>
        <BlackShortButton style={{ marginTop: "10px" }} onClick={go_History}>
          히스토리
        </BlackShortButton>
      </div>
    );
    // router.push("/register");
  }

  return (
    <LoginButton
      style={{ marginTop: "50px" }}
      onClick={async () => {
        await signIn();
      }}
    >
      Social LogIn
    </LoginButton>
  );
}

export default SignInButton;

const LoginButton = styled.div`
  width: 300px;
  height: 60px;
  border-radius: 10px;
  background-color: white;
  color: #121212;

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  font-size: 20px;
  font-weight: 500;
`;

const BlackShortButton = styled.div`
  width: 300px;
  height: 50px;
  border-radius: 10px;
  background-color: white;
  color: #121212;

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  font-size: 20px;
  font-weight: 500;
`;
