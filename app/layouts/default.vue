<template>
  <div class="h-screen flex flex-col text-white" style="background: linear-gradient(180deg, #0d1f1c 0%, #0a1410 100%);">
    <div class="flex flex-1 overflow-hidden">
      <Sidebar class="hidden md:flex" />

      <main class="flex-1 overflow-y-auto p-4 md:p-6 pb-4">
        <slot />
      </main>
    </div>

    <PlayerBar />
    <BottomNav class="md:hidden" />
  </div>
</template>