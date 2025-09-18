import React from 'react'
import NextError from 'next/error'

function ErrorPage({ statusCode }) {
    // Fallback to 500 if nothing is provided
    const code = typeof statusCode === 'number' ? statusCode : 500
    return <NextError statusCode={code} />
}

ErrorPage.getInitialProps = ({ res, err }) => {
    const statusCode = res?.statusCode ?? err?.statusCode ?? 500
    return { statusCode }
}

export default ErrorPage
