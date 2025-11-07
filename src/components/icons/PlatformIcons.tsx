import { siYoutube, siX, siTiktok, siInstagram, siPinterest } from 'simple-icons'
import { Linkedin, Share2 } from 'lucide-react'

interface IconProps {
  size?: number
  className?: string
}

export function YouTubeIcon({ size = 36, className = '' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={`#${siYoutube.hex}`}>
      <path d={siYoutube.path} />
    </svg>
  )
}

export function LinkedInIcon({ size = 36, className = '' }: IconProps) {
  return <Linkedin className={className} size={size} color="#0A66C2" />
}

export function XIcon({ size = 36, className = '' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={`#${siX.hex}`}>
      <path d={siX.path} />
    </svg>
  )
}

export function TikTokIcon({ size = 36, className = '' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={`#${siTiktok.hex}`}>
      <path d={siTiktok.path} />
    </svg>
  )
}

export function InstagramIcon({ size = 36, className = '' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={`#${siInstagram.hex}`}>
      <path d={siInstagram.path} />
    </svg>
  )
}

export function PinterestIcon({ size = 36, className = '' }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={`#${siPinterest.hex}`}>
      <path d={siPinterest.path} />
    </svg>
  )
}

export function OpenGraphIcon({ size = 36, className = '' }: IconProps) {
  return <Share2 className={className} size={size} color="#1da1f2" />
}
