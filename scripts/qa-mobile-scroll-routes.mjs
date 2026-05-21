import { readFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()

async function read(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8')
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

async function assertContains(relativePath, checks) {
  const source = await read(relativePath)
  for (const check of checks) {
    assert(source.includes(check), `${relativePath} no contiene: ${check}`)
  }
}

async function validateSourceGuards() {
  await assertContains('src/App.tsx', ['<ScrollToTop />'])
  await assertContains('src/components/navigation/ScrollToTop.tsx', [
    'useLocation',
    'scrollRestoration',
    'scrollToHash',
    'scrollToPageTop',
  ])
  await assertContains('src/index.css', [
    'scroll-behavior: auto',
    'scroll-margin-top: 96px',
  ])
  await assertContains('src/components/layout/AppShell.tsx', [
    'resetPrivateNavigation',
    'data-scroll-root',
    'onClick={resetPrivateNavigation}',
  ])
  await assertContains('src/pages/CommunityFeedPage.tsx', [
    'feedTopRef',
    'postRefs',
    'handlePostFilterChange',
  ])
  await assertContains('src/pages/BiblePage.tsx', [
    'readerRef',
    'chapterListRef',
    'searchRef',
    'aiRef',
  ])
  await assertContains('src/pages/FaithGamesPage.tsx', [
    'gameAreaRef',
    'resultRef',
  ])
  await assertContains('src/pages/WorldMapPage.tsx', [
    'directoryRef',
    'detailRef',
    'suggestionFormRef',
  ])
  await assertContains('src/pages/MessagesPage.tsx', [
    'messageListRef',
    'data-scroll-root',
  ])
}

async function validateStagingRoutes() {
  const baseUrl = process.env.QA_APP_BASE_URL
  if (!baseUrl) {
    return ['QA_APP_BASE_URL no configurado: se ejecuto validacion estatica local.']
  }

  const routes = [
    '/app',
    '/app/foros',
    '/app/biblia',
    '/app/juegos',
    '/app/mapa',
    '/app/oracion',
    '/app/admin',
  ]
  const observations = []

  for (const route of routes) {
    const response = await fetch(new URL(route, baseUrl), { redirect: 'manual' })
    assert(
      response.status !== 404 && response.status < 500,
      `${route} respondio ${response.status}`,
    )
    observations.push(`${route}: HTTP ${response.status}`)
  }

  return observations
}

try {
  await validateSourceGuards()
  const observations = await validateStagingRoutes()
  for (const observation of observations) {
    console.log(observation)
  }
  console.log('QA_MOBILE_SCROLL_OK')
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
}
