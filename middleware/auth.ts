export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client-side
  if (import.meta.server) return

  const { isAuthenticated, loading } = useAuth()

  // Wait for auth to initialize (with timeout)
  if (loading.value) {
    await new Promise<void>((resolve) => {
      const unwatch = watch(loading, (newValue) => {
        if (!newValue) {
          unwatch()
          resolve()
        }
      }, { immediate: true })

      // Timeout after 3 seconds
      setTimeout(() => {
        unwatch()
        resolve()
      }, 3000)
    })
  }

  // Check if user is authenticated
  if (!isAuthenticated.value) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
