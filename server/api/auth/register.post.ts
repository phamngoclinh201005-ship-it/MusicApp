export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const {name, email, password} = body
    if(!name || !email || !password) {
        throw createError({statusCode: 400, message:'Thiếu thông tin'})
    }
    const storage = useStorage('data') 
    const users = await storage.getItem('users') as any[] ?? []
    if(users.find((u: any ) => u.email === email)) {
        throw createError({statusCode: 409, message: 'Email đã được dùng'})
    }
    const newUser = {
        id: Date.now(),
        name, 
        email,
        password
    }
    users.push(newUser)
    await storage.setItem('users', users)
    return {message: 'Đăng ký thành công '}
})