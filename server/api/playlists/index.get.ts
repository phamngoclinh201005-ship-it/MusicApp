import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader) {
    throw createError({ statusCode: 401, message: 'Chưa đăng nhập' })
  }

  const token = authHeader.replace('Bearer ', '')
  const config = useRuntimeConfig()

  let decoded: any
  try {
    decoded = jwt.verify(token, config.jwtSecret)
  } catch {
    throw createError({ statusCode: 401, message: 'Token không hợp lệ' })
  }

  const storage = useStorage('data')
  const playlists = (await storage.getItem('playlists') as any[]) ?? []
  const songs = (await storage.getItem('songs') as any[]) ?? []

  const myPlaylists = playlists
    .filter(p => p.userId === decoded.userId)
    .map(p => ({
      ...p,
      songs: p.songIds.map((id: number) => songs.find(s => s.id === id)).filter(Boolean)
    }))

  return myPlaylists
})