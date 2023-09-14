// express 역할
import prisma from "../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { useSearchParams } from "next/navigation";

export const GET = async (req, res) => {
  try {
    const params = useSearchParams();
    // const auth = params.get('auth');
    console.log(params);

    // const user = await prisma.user.findFirst({
    //   where: {
    //     auth,
    //   },
    // });

    // console.log(auth);

    // user가 없는 경우 에러 처리
    // 콘솔 에러 400번 발생. response에서 'Not exist token.' 확인
    if (!user) {
      return json(
        {
          ok: false,
          error: "Not exist token.",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error(error);
  }
};

// 함수명이 해당하는 요청으로 정해져있음. (POST), DB와 상호작용하니 비동기로 해야 함
// 응답 할 때 까지 기다려서 응답이 꼭 있어야 함.
export const POST = async (req, res) => {
  try {
    // json에 body가 담겨있음

    const { auth, pvk, nickname, login_type } = await req.json();
    // console.log(auth, pvk, nickname, pvk);

    // upsert = update + create (처음 들어오면 만들고 있으면 업데이트)
    const user = await prisma.user.upsert({
      where: { auth },
      update: {},
      create: {
        login_type,
        address: pvk,
        nickname,
        auth,
        count: 0,
      },
    });

    // console.log()는 npm run dev 했던 터미널에서 확인 가능

    return NextResponse.json({ ok: true, user });
  } catch (error) {
    console.error(error);
  }
};
