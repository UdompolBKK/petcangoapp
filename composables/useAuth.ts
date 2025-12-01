import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User,
  type UserCredential
} from 'firebase/auth'

export const useAuth = () => {
  const { auth } = useFirebase()
  const user = useState<User | null>('user', () => null)
  const loading = useState<boolean>('auth-loading', () => true)
  const error = useState<string | null>('auth-error', () => null)

  // Initialize auth state listener
  onMounted(() => {
    onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser
      loading.value = false
    })
  })

  /**
   * Sign in with Email and Password
   */
  const signInWithEmail = async (email: string, password: string): Promise<UserCredential | null> => {
    try {
      error.value = null
      loading.value = true
      const credential = await signInWithEmailAndPassword(auth, email, password)
      user.value = credential.user
      return credential
    } catch (err: any) {
      error.value = getErrorMessage(err.code)
      console.error('Email sign in error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Sign up with Email and Password
   */
  const signUpWithEmail = async (email: string, password: string): Promise<UserCredential | null> => {
    try {
      error.value = null
      loading.value = true
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      user.value = credential.user
      return credential
    } catch (err: any) {
      error.value = getErrorMessage(err.code)
      console.error('Email sign up error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Sign in with Google
   */
  const signInWithGoogle = async (): Promise<UserCredential | null> => {
    try {
      error.value = null
      loading.value = true
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({
        prompt: 'select_account'
      })
      const credential = await signInWithPopup(auth, provider)
      user.value = credential.user
      return credential
    } catch (err: any) {
      error.value = getErrorMessage(err.code)
      console.error('Google sign in error:', err)
      return null
    } finally {
      loading.value = false
    }
  }


  /**
   * Sign out
   */
  const logout = async (): Promise<boolean> => {
    try {
      error.value = null
      await signOut(auth)
      user.value = null
      return true
    } catch (err: any) {
      error.value = getErrorMessage(err.code)
      console.error('Sign out error:', err)
      return false
    }
  }

  /**
   * Get user-friendly error messages
   */
  const getErrorMessage = (code: string): string => {
    const errorMessages: Record<string, string> = {
      'auth/email-already-in-use': 'อีเมลนี้ถูกใช้งานแล้ว',
      'auth/invalid-email': 'รูปแบบอีเมลไม่ถูกต้อง',
      'auth/user-not-found': 'ไม่พบผู้ใช้งานนี้',
      'auth/wrong-password': 'รหัสผ่านไม่ถูกต้อง',
      'auth/weak-password': 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
      'auth/too-many-requests': 'คำขอมากเกินไป กรุณาลองใหม่ภายหลัง',
      'auth/popup-closed-by-user': 'ปิดหน้าต่างการเข้าสู่ระบบ',
      'auth/cancelled-popup-request': 'ยกเลิกการเข้าสู่ระบบ',
      'auth/account-exists-with-different-credential': 'บัญชีนี้มีอยู่แล้วด้วยวิธีการเข้าสู่ระบบอื่น'
    }
    return errorMessages[code] || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
  }

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = computed(() => !!user.value)

  /**
   * Check if user is Super Admin
   * ตรวจสอบจาก custom claims ใน Firebase Auth
   */
  const isSuperAdmin = computed(() => {
    if (!user.value) return false

    // ตรวจสอบจาก custom claims
    // @ts-ignore
    const claims = user.value?.reloadUserInfo?.customAttributes
    if (claims) {
      try {
        const parsed = JSON.parse(claims)
        return parsed.superAdmin === true || parsed.role === 'superadmin'
      } catch {
        return false
      }
    }

    // Fallback: ตรวจสอบจาก email (สำหรับ development)
    const superAdminEmails = ['udompol.bkk@gmail.com']
    return superAdminEmails.includes(user.value?.email || '')
  })

  /**
   * Check if user is admin (includes Super Admin)
   * ตรวจสอบจาก custom claims ใน Firebase Auth
   */
  const isAdmin = computed(() => {
    if (!user.value) return false

    // Super Admin is also Admin
    if (isSuperAdmin.value) return true

    // ตรวจสอบจาก custom claims
    // @ts-ignore
    const claims = user.value?.reloadUserInfo?.customAttributes
    if (claims) {
      try {
        const parsed = JSON.parse(claims)
        return parsed.admin === true || parsed.role === 'admin'
      } catch {
        return false
      }
    }

    return false
  })

  /**
   * Get user role
   */
  const userRole = computed(() => {
    if (isSuperAdmin.value) return 'superadmin'
    if (isAdmin.value) return 'admin'
    if (isAuthenticated.value) return 'user'
    return 'guest'
  })

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    userRole,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    logout
  }
}
