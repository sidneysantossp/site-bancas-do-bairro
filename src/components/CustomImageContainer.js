import React, { useEffect, useState } from 'react'
import { CustomImageContainerStyled } from '@/styled-components/CustomStyles.style'
import placeholder from '../../public/static/notimage.png'

// Normalize incoming image URLs: ensure scheme, handle protocol-relative (//), and encode spaces
const normalizeImageUrl = (url) => {
    try {
        if (!url || typeof url !== 'string') return placeholder.src
        let u = url.trim()
        if (!u) return placeholder.src
        if (u.startsWith('//')) {
            u = 'https:' + u
        } else if (u.toLowerCase().startsWith('http://')) {
            // Não force HTTPS quando:
            // - hostname é localhost, 127.0.0.1 ou termina com .local
            // - hostname é IP privado (10.x.x.x, 172.16-31.x.x, 192.168.x.x)
            // - a página atual está sendo servida em http
            try {
                const parsed = new URL(u)
                const host = parsed.hostname
                const isPrivateIP =
                    /^10\./.test(host) ||
                    /^192\.168\./.test(host) ||
                    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host)
                const isLocal =
                    host === 'localhost' ||
                    host === '127.0.0.1' ||
                    host.endsWith('.local') ||
                    isPrivateIP
                const pageIsHttp =
                    typeof window !== 'undefined' && window.location && window.location.protocol === 'http:'
                if (!isLocal && !pageIsHttp) {
                    // Prefer HTTPS apenas quando não é local/privado e a página já está em https
                    u = u.replace(/^http:\/\//i, 'https://')
                }
            } catch (_) {
                // Se não for URL absoluta válida, não force https
            }
        }
        // Mapear caminhos relativos comuns do backend para o proxy do Next
        // Exemplos vindos do backend: 'storage/abc.jpg', 'public/storage/abc.jpg', '/public/storage/abc.jpg'
        if (/^public\/?storage\//i.test(u)) {
            // remove prefix 'public/' se existir
            u = u.replace(/^public\//i, '')
        }
        if (/^\/public\/storage\//i.test(u)) {
            u = u.replace(/^\/public\/storage\//i, '/storage/')
        }
        if (/^storage\//i.test(u)) {
            // garantir barra inicial para acionar rewrite '/storage/:path*'
            u = '/' + u
        }
        if (/^\/storage\//i.test(u)) {
            // já está correto para o rewrite do Next
        }
        // Encode spaces
        u = u.replace(/\s/g, '%20')
        return u
    } catch (_) {
        return placeholder.src
    }
}

const CustomImageContainer = ({
    cursor,
    mdHeight,
    maxWidth,
    height,
    width,
    objectFit,
    minwidth,
    src,
    alt,
    borderRadius,
    marginBottom,
    smHeight,
    smMb,
    smMaxWidth,
    smWidth,
    test_image,
    aspectRatio,
    boxShadow,
    loading,
}) => {
    const [imageFile, setState] = useState(null)
    const [newObjectFit, setNewObjectFit] = useState(objectFit)
    useEffect(() => {
        if (src) {
            setState(normalizeImageUrl(src))
        } else {
            setState(placeholder.src)
            setNewObjectFit('contain')
        }
    }, [src])

    return (
        <CustomImageContainerStyled
            height={height}
            width={width}
            objectFit={newObjectFit}
            minwidth={minwidth}
            borderRadu={borderRadius}
            marginBottom={marginBottom}
            smHeight={smHeight}
            smMb={smMb}
            maxWidth={maxWidth}
            smMaxWidth={smMaxWidth}
            smWidth={smWidth}
            mdHeight={mdHeight}
            cursor={cursor}
            aspectRatio={aspectRatio}
            boxShadow={boxShadow}
        >
            <img
                src={imageFile}
                alt={alt}
                onError={(e) => {
                    // currentTarget.onerror = null; // prevents looping
                    setState(test_image ? test_image.src : placeholder.src)
                    e.target.style =
                        'objectFit:contain !important;width:auto !important;'
                    e.target.style.margin = 'auto'
                }}
                loading={loading || 'lazy'}
            />
        </CustomImageContainerStyled>
    )
}
export default CustomImageContainer
