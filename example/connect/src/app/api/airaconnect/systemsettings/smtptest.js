const fieldChecks = [
  {
    fieldName: 'to',
    fieldType: 'array',
    required: true,
  },
  {
    fieldName: 'subject',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'body',
    fieldType: 'string',
    required: false,
  },
  {
    fieldName: 'images',
    fieldType: 'array',
    required: false,
  },
]

module.exports = (data) => {
  global.spiderman.systemlog.writeInfo('systemsettings smtptest')

  const { host, port, secure, user, pass, from } = global.params.smtp
  let { subject, to, body, images } = data

  subject = subject || 'aira application smtp test'
  body = body || 'aira application smtp test'
  images = images || []

  if (images.length <= 0) {
    images[0]
      = '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'
  }

  global.spiderman.mailer.send(
    host,
    port,
    secure,
    user,
    pass,
    from,
    subject,
    to,
    [],
    [],
    body,
    images,
  )

  const ret = {
    message: 'ok',
  }

  global.spiderman.systemlog.writeInfo(
    `systemsettings smtptest ${JSON.stringify(ret)}`,
  )

  return ret
}
