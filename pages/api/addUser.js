import prisma, {checkUserExists} from '@/lib/prisma';
import {Web3} from 'web3';

const web3 = new Web3("http://localhost:3000");

export default async function handler(req, res) {
  const newWeb3Account = web3.eth.accounts.create();

  if (req.method === 'POST') {
    try {
      const isUserExist = await checkUserExists(req.body.nickname)

      if (!isUserExist) {
        const user = await prisma.user.create({
          data: {
            nickname: req.body.nickname,
            address: newWeb3Account.privateKey,
            login_type: 'naver',  // TODO: Retrieve from a req later.
            count: 1,
            auth: req.body.accessToken
          }
        })
      }

      res.status(200).json({message: 'ok'})
    } catch (e) {
      res.status(500).json({error: 'UserCreateError'})
    }
  }
}