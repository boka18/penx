import { fetchEventSource } from '@microsoft/fetch-event-source'
import { db } from '@penx/local-db'
import { pullFromCloud } from '@penx/sync'
import { trpc } from '@penx/trpc-client'

type SpaceInfo = {
  spaceId: string
  userId: string
  lastModifiedTime: number
}

async function pull(spaceInfo: SpaceInfo) {
  if (!spaceInfo?.spaceId) return

  const space = await db.getSpace(spaceInfo.spaceId)
  if (space) {
    const localLastModifiedTime = await db.getLastModifiedTime(space.id)

    console.log(
      'spaceInfo.lastModifiedTime > localLastModifiedTime:',
      spaceInfo.lastModifiedTime > localLastModifiedTime,
      spaceInfo.lastModifiedTime,
      localLastModifiedTime,
    )

    if (spaceInfo.lastModifiedTime > localLastModifiedTime) {
      await pullFromCloud(space)
    }
  }
}

export async function runSSE() {
  const token = await trpc.user.sseToken.query()

  await fetchEventSource(process.env.NEXT_PUBLIC_SPACE_INFO_SSE_URL!, {
    openWhenHidden: true,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
    async onopen(response) {
      console.log('=========onopen', response)
    },
    onmessage(ev) {
      // console.log('===============ev.data:', ev.data)
      const spaceInfo: SpaceInfo = JSON.parse(ev.data)
      console.log('===========spaceInfo:', spaceInfo)
      pull(spaceInfo)
    },
    onclose() {
      // if the server closes the connection unexpectedly, retry:
      console.log('sse onclose=============')
    },
    onerror(err) {
      console.log('sse error=============:', err)
      // do nothing to automatically retry. You can also
      // return a specific retry interval here.
    },
  })
}
