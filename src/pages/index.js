import { useEffect } from 'react'

export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/home',
      permanent: false, // 307 temporário enquanto validamos em produção
    },
  }
}

export default function RootRedirect() {
  // Fallback no cliente caso o redirect SSR não seja aplicado na borda
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.replace('/home')
    }
  }, [])
  return null
}