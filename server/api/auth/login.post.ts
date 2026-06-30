import jwt from 'jsonwebtoken'

export default defineEventHandler(async(event) => {
    const body = await readBody(event)
    const {email, password} = body
    const storage = useStorage('data')
    const users = await storage.getItem('users') as any[] ?? []
    const user = users.find((u: any) => 
    u.email === email && u.password === password)
    if (!user) {
        throw createError({ statusCode: 401, message: 'Sai email hoặc mật khẩu' })
    }
    const config = useRuntimeConfig()
    const token = jwt.sign(
        {
            userId: user.id, 
            name: user.name, 
            email: user.email
        },
        config.jwtSecret,
        {
            expiresIn: '7d' //hiệu lực 7 ngày 
        }
    )
    return {
        token,
        user: { 
            id: user.id, 
            name: user.name, 
            email: user.email 
        }
    }
})