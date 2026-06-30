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
  const users = (await storage.getItem('users') as any[]) ?? []
  const songs = (await storage.getItem('songs') as any[]) ?? []
  const playlists = (await storage.getItem('playlists') as any[]) ?? []

  const user = users.find((u: any) => u.id === decoded.userId)
  if (!user) {
    throw createError({ statusCode: 404, message: 'Không tìm thấy user' })
  }

  const mySongs = songs.filter((s: any) => s.uploadedBy === decoded.userId)
  const myPlaylists = playlists.filter((p: any) => p.userId === decoded.userId)

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl || null,
    createdAt: user.createdAt || null,
    stats: {
      songsUploaded: mySongs.length,
      playlistsCreated: myPlaylists.length
    }
  }
})