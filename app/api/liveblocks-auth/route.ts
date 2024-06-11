// import { a } from '@clerk/nextjs'
import { currentUser,auth } from '@clerk/nextjs/server'
import { Liveblocks } from '@liveblocks/node'
import { ConvexHttpClient } from 'convex/browser'

import { api } from '@/convex/_generated/api'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

const liveblocks = new Liveblocks({
  secret: "sk_dev_F3AJGb2eIrbm9MdWT1zvfpi69jjHbvoinDlWhDwcKtECp53aB2_7tR-IWai7_MUf"
})

export async function POST(request: Request) {
  const authorization = await auth()
  const user = await currentUser()

  if (!authorization || !user) {
    return new Response('Unauthorized', { status: 403 })
  }


  // console.log("authInfo:",{
  //   authorization,
  //   user,
  // })

  const { room } = await request.json()
  const board = await convex.query(api.board.get, { id: room })

  if (board?.orgId !== authorization.orgId) {
    return new Response('Unauthorized', { status: 403 })
  }

  // console.log({
  //   room,
  //   board,
  //   boardOrgId: board?.orgId,
  //   userOrgId: authorization.orgId,
  // })



  const userInfo = {
    name: user.firstName || 'Teammeate',
    picture: user.imageUrl,
  }

  // console.log({userInfo})

  const session = liveblocks.prepareSession(user.id, { userInfo })

  if (room) {
    session.allow(room, session.FULL_ACCESS)
  }

  const { status, body } = await session.authorize()
  // console.log({status,body},"ALLoWED");
  return new Response(body, { status })
}