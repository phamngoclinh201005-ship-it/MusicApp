export default defineEventHandler(async () => {
  const storage = useStorage('data')
  const songs = (await storage.getItem('songs') as any[]) ?? []

  return songs.sort((a, b) =>
    new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  )
  
})