import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const storage = useStorage('data')
  const songs = (await storage.getItem('songs') as any[]) ?? []

  let userId: number | null = null

  const authHeader = getHeader(event, 'authorization')

  if (authHeader) {
    try {
      const token = authHeader.replace('Bearer ', '')
      const decoded: any = jwt.verify(token, useRuntimeConfig().jwtSecret)
      userId = decoded.userId
    } catch {}
  }

  return songs
    .sort((a, b) =>
      new Date(b.uploadedAt).getTime() -
      new Date(a.uploadedAt).getTime()
    )
    .map(song => ({
      ...song,
      liked: userId
        ? song.likedUsers?.includes(userId)
        : false
    }))
})