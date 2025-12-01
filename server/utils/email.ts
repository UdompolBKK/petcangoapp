/**
 * Email utility for sending notifications
 * Uses Nodemailer with SMTP configuration
 *
 * Required environment variables:
 * - SMTP_HOST: SMTP server host
 * - SMTP_PORT: SMTP server port
 * - SMTP_USER: SMTP username
 * - SMTP_PASS: SMTP password
 * - SMTP_FROM: From email address
 */

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

interface HotelApprovalEmailData {
  hotelName: string
  ownerEmail: string
  hotelUrl?: string
}

interface HotelRejectionEmailData {
  hotelName: string
  ownerEmail: string
  reason: string
}

/**
 * Send email using Nodemailer
 * Falls back to console.log in development if SMTP is not configured
 */
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  const config = useRuntimeConfig()

  // Check if SMTP is configured
  if (!config.smtpHost || !config.smtpUser) {
    console.log('📧 Email would be sent (SMTP not configured):')
    console.log(`To: ${options.to}`)
    console.log(`Subject: ${options.subject}`)
    console.log(`Body: ${options.text || options.html}`)
    return true
  }

  try {
    // Dynamic import nodemailer only when needed
    const nodemailer = await import('nodemailer')

    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: Number(config.smtpPort) || 587,
      secure: Number(config.smtpPort) === 465,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass
      }
    })

    await transporter.sendMail({
      from: config.smtpFrom || config.smtpUser,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    })

    console.log(`✅ Email sent to ${options.to}`)
    return true
  } catch (error) {
    console.error('❌ Failed to send email:', error)
    return false
  }
}

/**
 * Send hotel approval notification email
 */
export const sendHotelApprovalEmail = async (data: HotelApprovalEmailData): Promise<boolean> => {
  const { hotelName, ownerEmail, hotelUrl } = data

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none; }
        .btn { display: inline-block; background: #14b8a6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .highlight { background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">🎉 ยินดีด้วย!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">ที่พักของคุณได้รับการอนุมัติแล้ว</p>
        </div>
        <div class="content">
          <p>สวัสดีครับ/ค่ะ,</p>
          <div class="highlight">
            <strong>"${hotelName}"</strong> ได้รับการอนุมัติและเผยแพร่บน PetCanGo เรียบร้อยแล้ว
          </div>
          <p>ตอนนี้ที่พักของคุณพร้อมรับลูกค้าแล้ว! เจ้าของสัตว์เลี้ยงทั่วประเทศจะสามารถค้นหาและติดต่อที่พักของคุณได้</p>
          ${hotelUrl ? `<p style="text-align: center;"><a href="${hotelUrl}" class="btn">ดูหน้าที่พักของคุณ</a></p>` : ''}
          <p>หากต้องการแก้ไขข้อมูลหรือจัดการที่พัก สามารถเข้าสู่ระบบและจัดการได้ที่หน้า "ที่พักของฉัน"</p>
          <p>ขอบคุณที่เป็นส่วนหนึ่งของ PetCanGo!</p>
        </div>
        <div class="footer">
          <p>PetCanGo - แพลตฟอร์มค้นหาที่พักสัตว์เลี้ยงทั่วประเทศไทย</p>
          <p>อีเมลนี้ถูกส่งอัตโนมัติ กรุณาอย่าตอบกลับ</p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
ยินดีด้วย! ที่พักของคุณได้รับการอนุมัติแล้ว

"${hotelName}" ได้รับการอนุมัติและเผยแพร่บน PetCanGo เรียบร้อยแล้ว

ตอนนี้ที่พักของคุณพร้อมรับลูกค้าแล้ว!

ขอบคุณที่เป็นส่วนหนึ่งของ PetCanGo
  `

  return sendEmail({
    to: ownerEmail,
    subject: `✅ "${hotelName}" ได้รับการอนุมัติแล้ว - PetCanGo`,
    html,
    text
  })
}

/**
 * Send hotel rejection notification email
 */
export const sendHotelRejectionEmail = async (data: HotelRejectionEmailData): Promise<boolean> => {
  const { hotelName, ownerEmail, reason } = data

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none; }
        .btn { display: inline-block; background: #14b8a6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .reason-box { background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">📝 แจ้งผลการตรวจสอบ</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">ที่พักของคุณยังไม่ผ่านการอนุมัติ</p>
        </div>
        <div class="content">
          <p>สวัสดีครับ/ค่ะ,</p>
          <p>ขออภัย <strong>"${hotelName}"</strong> ยังไม่ผ่านการตรวจสอบในครั้งนี้</p>
          <div class="reason-box">
            <strong>เหตุผล:</strong><br>
            ${reason}
          </div>
          <p>คุณสามารถแก้ไขข้อมูลและส่งตรวจสอบใหม่ได้ที่หน้า "ที่พักของฉัน"</p>
          <p style="text-align: center;">
            <a href="https://petcango.com/my-hotels" class="btn">แก้ไขข้อมูลที่พัก</a>
          </p>
          <p>หากมีข้อสงสัย สามารถติดต่อทีมงานได้ทาง support@petcango.com</p>
        </div>
        <div class="footer">
          <p>PetCanGo - แพลตฟอร์มค้นหาที่พักสัตว์เลี้ยงทั่วประเทศไทย</p>
          <p>อีเมลนี้ถูกส่งอัตโนมัติ กรุณาอย่าตอบกลับ</p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
แจ้งผลการตรวจสอบ

ขออภัย "${hotelName}" ยังไม่ผ่านการตรวจสอบในครั้งนี้

เหตุผล: ${reason}

คุณสามารถแก้ไขข้อมูลและส่งตรวจสอบใหม่ได้ที่หน้า "ที่พักของฉัน"

หากมีข้อสงสัย สามารถติดต่อทีมงานได้ทาง support@petcango.com

PetCanGo
  `

  return sendEmail({
    to: ownerEmail,
    subject: `📝 "${hotelName}" ยังไม่ผ่านการอนุมัติ - PetCanGo`,
    html,
    text
  })
}
