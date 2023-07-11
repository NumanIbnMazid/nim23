import Image from 'next/image'

type Props = {
  src: string;
  caption?: string;
  alt?: string;
};

export default function figcaption({ src, caption, alt }: Props) {
  if (caption !== undefined) {
    return (
      <figure>
        <Image src={src} alt={alt || "Image"} width={1000} height={1000} quality={75} style={{ width: "auto", height: "auto" }} />
        <figcaption>{caption}</figcaption>
      </figure>
    );
  } else {
    return <Image src={src} alt={alt || "Image"} width={1000} height={1000} quality={75} style={{ width: "auto", height: "auto" }} />
  }
}
