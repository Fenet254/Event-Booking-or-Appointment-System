// pages/_app.tsx
import '../styles.css'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { motion } from 'framer-motion'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Component {...pageProps} />
        </motion.div>
      </ThemeProvider>
    </SessionProvider>
  )
}
