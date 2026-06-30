<script setup lang="ts">
const auth = useAuthStore()
const { $api } = useNuxtApp()
const api = $api as any

interface UserProfile {
  id: number
  name: string
  email: string
  avatarUrl: string | null
  createdAt: string | null
  stats: {
    songsUploaded: number
    playlistsCreated: number
  }
}

const { data: profile, refresh } = await useAsyncData<UserProfile>('my-profile', () =>
  api('/users/me')
)

// === Upload avatar ===
const avatarInput = ref<HTMLInputElement | null>(null)
const uploadingAvatar = ref(false)

const triggerAvatarPicker = () => {
  avatarInput.value?.click()
}

const handleAvatarChange = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  try {
    uploadingAvatar.value = true
    const formData = new FormData()
    formData.append('avatar', file)

    await api('/users/avatar', {
      method: 'POST',
      body: formData
    })

    await refresh()
    await auth.refreshUser()
  } catch (e: any) {
    alert(e.data?.message || 'Upload avatar thất bại')
  } finally {
    uploadingAvatar.value = false
  }
}

// === Đổi mật khẩu ===
const showPasswordForm = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordError = ref('')
const passwordSuccess = ref(false)
const changingPassword = ref(false)

const handleChangePassword = async () => {
  passwordError.value = ''
  passwordSuccess.value = false

  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = 'Mật khẩu xác nhận không khớp'
    return
  }

  try {
    changingPassword.value = true
    await api('/users/password', {
      method: 'POST',
      body: {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value
      }
    })
    passwordSuccess.value = true
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    setTimeout(() => { showPasswordForm.value = false; passwordSuccess.value = false }, 1500)
  } catch (e: any) {
    passwordError.value = e.data?.message || 'Đổi mật khẩu thất bại'
  } finally {
    changingPassword.value = false
  }
}
</script>

<template>
  <div v-if="profile" class="max-w-3xl mx-auto">
    <!-- Header profile -->
    <div class="flex items-center gap-6 mb-10">
      <div class="relative group">
        <img
          :src="profile.avatarUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=' + profile.name"
          class="w-28 h-28 rounded-full object-cover border-4 border-gray-800"
        />
        <button
          class="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          :disabled="uploadingAvatar"
          @click="triggerAvatarPicker"
        >
          <UIcon
            :name="uploadingAvatar ? 'i-lucide-loader-2' : 'i-lucide-camera'"
            class="w-7 h-7 text-white"
            :class="{ 'animate-spin': uploadingAvatar }"
          />
        </button>
        <input
          ref="avatarInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleAvatarChange"
        />
      </div>

      <div>
        <h1 class="text-2xl font-bold">{{ profile.name }}</h1>
        <p class="text-gray-400 text-sm">{{ profile.email }}</p>
        <UBadge color="success" variant="subtle" class="mt-2">Miễn phí</UBadge>
      </div>
    </div>

    <!-- Thống kê -->
    <div class="grid grid-cols-2 gap-4 mb-10">
      <UCard>
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
            <UIcon name="i-lucide-upload" class="w-6 h-6 text-primary" />
          </div>
          <div>
            <p class="text-2xl font-bold text-green-400">{{ profile.stats.songsUploaded }}</p>
            <p class="text-sm text-gray-400">Bài hát đã tải lên</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <UIcon name="i-lucide-list-music" class="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p class="text-2xl font-bold text-purple-400">{{ profile.stats.playlistsCreated }}</p>
            <p class="text-sm text-gray-400">Playlist đã tạo</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Cài đặt tài khoản -->
    <UCard>
      <template #header>
        <h2 class="font-semibold text-black">Cài đặt tài khoản</h2>
      </template>

      <div class="space-y-4">
        <div class="flex items-center justify-between py-2">
          <div>
            <p class="text-sm font-medium text-black">Mật khẩu</p>
            <p class="text-xs text-gray-400">Đổi mật khẩu đăng nhập của bạn</p>
          </div>
          <UButton variant="outline" size="sm" @click="showPasswordForm = !showPasswordForm">
            {{ showPasswordForm ? 'Hủy' : 'Đổi mật khẩu' }}
          </UButton>
        </div>

        <!-- Form đổi mật khẩu -->
        <div v-if="showPasswordForm" class="pt-2 border-t space-y-3">
          <UInput v-model="currentPassword" type="password" placeholder="Mật khẩu hiện tại" />
          <UInput v-model="newPassword" type="password" placeholder="Mật khẩu mới (tối thiểu 6 ký tự)" />
          <UInput v-model="confirmPassword" type="password" placeholder="Xác nhận mật khẩu mới" />

          <p v-if="passwordError" class="text-red-500 text-sm">{{ passwordError }}</p>
          <p v-if="passwordSuccess" class="text-green-500 text-sm">Đổi mật khẩu thành công!</p>

          <UButton block :loading="changingPassword" @click="handleChangePassword">
            Lưu thay đổi
          </UButton>
        </div>
      </div>
    </UCard>
    <UCard class="mt-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-black">Đăng xuất</p>
          <p class="text-xs text-gray-400">Thoát khỏi tài khoản trên thiết bị này</p>
        </div>
        <UButton color="error" variant="outline" @click="auth.logout()">
          Đăng xuất
        </UButton>
      </div>
    </UCard>
  </div>
</template>