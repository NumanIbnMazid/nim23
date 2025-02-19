import LogoImage from "@/assets/logo.png";
import Image from 'next/image'

export default function Logo({ className }: { className: string }) {
  return (
    <Image
        src={LogoImage}
        className={className}
        width={933}
        height={933}
        alt="Dark Background Image"
        quality={100}
      />
  )
}
