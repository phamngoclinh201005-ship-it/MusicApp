import jwt from 'jsonwebtoken'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

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

  const formData = await readMultipartFormData(event)
  if (!formData) {
    throw createError({ statusCode: 400, message: 'Không có dữ liệu' })
  }

  const avatarFile = formData.find(f => f.name === 'avatar')
  if (!avatarFile) {
    throw createError({ statusCode: 400, message: 'Thiếu file ảnh' })
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }

  const ext = path.extname(avatarFile.filename || '.jpg')
  const fileName = `avatar_${decoded.userId}_${Date.now()}${ext}`
  await writeFile(path.join(uploadDir, fileName), avatarFile.data)

  const storage = useStorage('data')
  const users = (await storage.getItem('users') as any[]) ?? []

  const updated = users.map((u: any) =>
    u.id === decoded.userId ? { ...u, avatarUrl: `/uploads/${fileName}` } : u
  )
  await storage.setItem('users', updated)

  return { avatarUrl: `/uploads/${fileName}` }
})