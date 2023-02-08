import { Router } from '@edgio/core'

export default new Router()
  .get(
    {
      path: '/',
      query: {
        url: /https\:\/\/.*/g,
      },
    },
    ({ renderWithApp }) => {
      renderWithApp()
    }
  )
  .fallback(({ send }) => {
    send('Blocked', 403)
  })
