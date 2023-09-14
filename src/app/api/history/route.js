import prisma from "../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// history 생성
export const POST = async (req) => {
  try {
    const { userId, imgurl, result } = await req.json();

    console.log(userId, imgurl, result);

    const res = await prisma.history.create({
      data: {
        userId,
        imgurl,
        result,
      },
    });

    return NextResponse.json({
      ok: true,
      res,
    });
  } catch (error) {
    console.error(error);
  }
};

// history 조회
export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const signedToken = searchParams.get("signkey");
    const id = searchParams.get("hid");

    if (!signedToken && !id) {
      return NextResponse.json(
        {
          ok: false,
          error: "Not exist token.",
        },
        {
          status: 400,
        }
      );
    }

    if (!id) {
      const user = await prisma.user.findFirst({
        where: {
          auth: signedToken,
        },
      });

      if (!user) {
        return NextResponse.json(
          {
            ok: false,
            error: "Not exist token.",
          },
          {
            status: 400,
          }
        );
      }

      const res_h = await prisma.history.findMany({
        where: {
          userId: user.id,
        },
        select: {
          imgurl: true,
          result: true,
        },
      });
    }

    if (!searchParams) {
      const res_h = await prisma.history.findMany({
        where: {
          id: id,
        },
      });
    }

    return NextResponse.json({
      ok: true,
      res_h,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
