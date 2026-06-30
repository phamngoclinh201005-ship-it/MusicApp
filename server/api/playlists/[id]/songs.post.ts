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

  const playlistId = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const { songId } = body

  const storage = useStorage('data')
  const playlists = (await storage.getItem('playlists') as any[]) ?? []

  const playlist = playlists.find(p => p.id === playlistId)
  if (!playlist) {
    throw createError({ statusCode: 404, message: 'Không tìm thấy playlist' })
  }
  if (playlist.userId !== decoded.userId) {
    throw createError({ statusCode: 403, message: 'Không có quyền' })
  }

  if (!playlist.songIds.includes(songId)) {
    playlist.songIds.push(songId)
  }

  await storage.setItem('playlists', playlists)
  return playlist
})