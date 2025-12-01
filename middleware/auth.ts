export default defineNuxtRouteMiddleware((to, from) => {
  const { user, isAuthenticated, loading } = useAuth()

  // Wait for auth to initialize
  if (loading.value) {
    return
  }

  // Check if user is authenticated
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})
