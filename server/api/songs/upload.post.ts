import jwt from 'jsonwebtoken'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  // Verify đăng nhập
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

  // Đọc multipart form data
  const formData = await readMultipartFormData(event)
  if (!formData) {
    throw createError({ statusCode: 400, message: 'Không có dữ liệu upload' })
  }

  let title = ''
  let artist = ''
  let audioFile: any = null
  let coverFile: any = null

  for (const field of formData) {
    if (field.name === 'title') title = field.data.toString()
    if (field.name === 'artist') artist = field.data.toString()
    if (field.name === 'audio') audioFile = field
    if (field.name === 'cover') coverFile = field
  }

  if (!title || !artist || !audioFile) {
    throw createError({ statusCode: 400, message: 'Thiếu thông tin hoặc file nhạc' })
  }

  // Tạo thư mục uploads nếu chưa có
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }

  // Lưu file audio
  const audioExt = path.extname(audioFile.filename || '.mp3')
  const audioFileName = `audio_${Date.now()}${audioExt}`
  await writeFile(path.join(uploadDir, audioFileName), audioFile.data)

  // Lưu file cover (nếu có)
  let coverFileName = ''
  if (coverFile) {
    const coverExt = path.extname(coverFile.filename || '.jpg')
    coverFileName = `cover_${Date.now()}${coverExt}`
    await writeFile(path.join(uploadDir, coverFileName), coverFile.data)
  }

  // Lưu metadata vào storage
  const storage = useStorage('data')
  const songs = (await storage.getItem('songs') as any[]) ?? []

  const newSong = {
    id: Date.now(),
    title,
    artist,
    audioUrl: `/uploads/${audioFileName}`,
    coverUrl: coverFileName ? `/uploads/${coverFileName}` : '/default-cover.png',
    duration: 0,
    uploadedBy: decoded.userId,
    uploadedAt: new Date().toISOString()
  }

  songs.push(newSong)
  await storage.setItem('songs', songs)

  return newSong
})