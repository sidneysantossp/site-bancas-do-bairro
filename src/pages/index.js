export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/home',
      permanent: false, // 307 temporário enquanto validamos em produção
    },
  }
}

export default function RootRedirect() {
  return null
}