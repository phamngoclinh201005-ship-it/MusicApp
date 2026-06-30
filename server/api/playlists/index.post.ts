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

  const body = await readBody(event)
  const { name } = body

  if (!name) {
    throw createError({ statusCode: 400, message: 'Thiếu tên playlist' })
  }

  const storage = useStorage('data')
  const playlists = (await storage.getItem('playlists') as any[]) ?? []

  const newPlaylist = {
    id: Date.now(),
    name,
    userId: decoded.userId,
    songIds: [],
    createdAt: new Date().toISOString()
  }

  playlists.push(newPlaylist)
  await storage.setItem('playlists', playlists)

  return newPlaylist
})