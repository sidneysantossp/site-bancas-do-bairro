export async function getServerSideProps(context) {
  const { bancaSlug, ...rest } = context.query
  // Preserve any extra query params when redirecting
  const query = new URLSearchParams(rest).toString()
  const destination = `/${bancaSlug}${query ? `?${query}` : ''}`
  return {
    redirect: {
      destination,
      permanent: true,
    },
  }
}

export default function BancaRedirect() {
  return null
}
