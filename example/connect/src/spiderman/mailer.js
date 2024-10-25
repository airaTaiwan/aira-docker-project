const nodemailer = require('nodemailer')

module.exports = () => {
  function send(
    host,
    port,
    security,
    email,
    password,
    sender,
    subject,
    to,
    cc,
    bcc,
    body,
    images,
  ) {
    const transporter = (() => {
      const config = {
        host,
        port, // 通常是465（SSL）或587（TLS）
        secure: security,
        requireTLS: !security,
        auth: {
          user: email,
          pass: password,
        },
        tls: {
          rejectUnauthorized: false, // don't verify certificates
          ciphers: 'SSLv3',
        },
        debug: true, // show debug output
        logger: true, // log information in console
      }

      return nodemailer.createTransport(config)
    })()

    const mailOptions = (() => {
      const attachments = images.map((image, index) => ({
        filename: `face-${index + 1}.png`,
        content: Buffer.from(image, 'base64'),
      }))

      return {
        headers: {
          'X-Spam-Flag': 'yes',
          'X-Spam-Level': '******',
          'X-GND-Spam-Score': '100',
          'X-GND-Status': 'SPAM',
        },
        from: `${sender} <${email}>`,
        subject,

        to,
        cc,
        bcc,

        text: body,
        attachments,
      }
    })()

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        global.spiderman.systemlog.writeError(`郵件發送失敗： ${error}`)
      }
      else {
        global.spiderman.systemlog.writeInfo(
          `郵件已成功發送： ${info.response}`,
        )
      }
    })
  }

  return {
    send,
  }
}
