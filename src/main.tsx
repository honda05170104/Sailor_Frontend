import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './App'
import { store } from './redux/store'
import { GlobalStyle } from './components/GlobalStyle'
import { initLiff } from './utils/liff'

async function bootstrap() {
  await initLiff()

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider store={store}>
        <GlobalStyle />
        <App />
      </Provider>
    </StrictMode>,
  )
}

void bootstrap()
