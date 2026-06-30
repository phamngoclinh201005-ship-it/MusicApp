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
  const { currentPassword, newPassword } = body

  if (!currentPassword || !newPassword) {
    throw createError({ statusCode: 400, message: 'Thiếu thông tin' })
  }

  if (newPassword.length < 6) {
    throw createError({ statusCode: 400, message: 'Mật khẩu mới phải từ 6 ký tự' })
  }

  const storage = useStorage('data')
  const users = (await storage.getItem('users') as any[]) ?? []

  const user = users.find((u: any) => u.id === decoded.userId)
  if (!user || user.password !== currentPassword) {
    throw createError({ statusCode: 401, message: 'Mật khẩu hiện tại không đúng' })
  }

  const updated = users.map((u: any) =>
    u.id === decoded.userId ? { ...u, password: newPassword } : u
  )
  await storage.setItem('users', updated)

  return { message: 'Đổi mật khẩu thành công' }
})