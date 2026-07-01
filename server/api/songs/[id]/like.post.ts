import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')

  if (!authHeader) {
    throw createError({
      statusCode: 401,
      message: 'Chưa đăng nhập'
    })
  }

  const token = authHeader.replace('Bearer ', '')
  const config = useRuntimeConfig()

  let decoded: any

  try {
    decoded = jwt.verify(token, config.jwtSecret)
  } catch {
    throw createError({
      statusCode: 401,
      message: 'Token không hợp lệ'
    })
  }

  const songId = Number(getRouterParam(event, 'id'))

  const storage = useStorage('data')
  const songs = (await storage.getItem('songs') as any[]) ?? []

  const song = songs.find(s => s.id === songId)

  if (!song) {
    throw createError({
      statusCode: 404,
      message: 'Không tìm thấy bài hát'
    })
  }

  if (!song.likedUsers) song.likedUsers = []
  if (!song.likes) song.likes = 0

  const index = song.likedUsers.indexOf(decoded.userId)

  if (index === -1) {
    song.likedUsers.push(decoded.userId)
  } else {
    song.likedUsers.splice(index, 1)
  }

  song.likes = song.likedUsers.length

  await storage.setItem('songs', songs)

  return {
    likes: song.likes,
    liked: index === -1
  }
})