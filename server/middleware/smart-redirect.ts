/**
 * Smart Redirect Middleware
 * ตรวจสอบ URL patterns ที่เปลี่ยนแปลงและ redirect อัตโนมัติ
 * รักษา SEO โดยใช้ 301 Permanent Redirect
 */

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const path = url.pathname

  // 1. Redirect /province/xxx -> /hotels/xxx (URL structure change)
  if (path.startsWith('/province/') && !path.startsWith('/province/[')) {
    const slug = path.replace('/province/', '')
    return sendRedirect(event, `/hotels/${slug}`, 301)
  }

  // 2. Redirect /blog/xxx -> /blogs/xxx (typo fix)
  if (path.startsWith('/blog/') && !path.startsWith('/blogs/')) {
    const slug = path.replace('/blog/', '')
    return sendRedirect(event, `/blogs/${slug}`, 301)
  }

  // 3. Redirect trailing slashes (SEO best practice)
  if (path.length > 1 && path.endsWith('/')) {
    const newPath = path.slice(0, -1)
    return sendRedirect(event, newPath + url.search, 301)
  }

  // 4. Redirect common old patterns
  const redirectMap: Record<string, string> = {
    '/home': '/',
    '/index': '/',
    '/hotel': '/hotels',
    '/provinces': '/all-province',
    '/blog': '/blogs',
    '/articles': '/blogs',
    '/article': '/blogs',
  }

  if (redirectMap[path]) {
    return sendRedirect(event, redirectMap[path], 301)
  }
})
