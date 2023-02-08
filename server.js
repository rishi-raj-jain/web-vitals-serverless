const express = require('express')
const { WEB_VITALS } = require('./web-vitals')
const playwright = require('playwright-aws-lambda')

const app = express()

const port = process.env.PORT || 3001

app.get('/', async (req, res) => {
  const { url, width = 360, height = 640 } = req.query
  const browser = await playwright.launchChromium()
  const context = await browser.newContext()
  // Copied from web vitals life.js
  await context.addInitScript(WEB_VITALS)
  // Add script to run after webvitals load
  await context.addInitScript(() => {
    webVitals.onFID((m) => console.log(JSON.stringify(m)))
    webVitals.onCLS((m) => console.log(JSON.stringify(m)))
    webVitals.onLCP((m) => console.log(JSON.stringify(m)))
    webVitals.onTTFB((m) => console.log(JSON.stringify(m)))
  })
  const page = await context.newPage()
  await page.setViewportSize({
    width,
    height,
  })
  // Save web vitals in a dictionary
  const webVitals = []
  page.on('console', async (msg) => {
    try {
      const webVital = JSON.parse(msg.text())
      if ('name' in webVital) {
        webVitals.push(webVital)
      }
    } catch (e) {
      console.log(e.message || e.toString())
    }
  })
  await page.goto(url)
  // To make sure all logs are recorded
  await page.close({ runBeforeUnload: true })
  // Wait for the Web Vitals event to be fired
  await page.waitForTimeout(15000)
  await browser.close()
  // Set the json headers
  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify(webVitals))
  res.status(200)
})

app.listen(port, () => {})
