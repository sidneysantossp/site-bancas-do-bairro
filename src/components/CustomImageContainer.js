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
            // Em dev/localhost, mantenha http para evitar falhas (sem TLS)
            try {
                const parsed = new URL(u)
                const host = parsed.hostname
                const isLocal = host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local')
                if (!isLocal) {
                    // Prefer HTTPS fora de ambiente local
                    u = u.replace(/^http:\/\//i, 'https://')
                }
            } catch (_) {
                // Se não for URL absoluta válida, não force https
            }
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
