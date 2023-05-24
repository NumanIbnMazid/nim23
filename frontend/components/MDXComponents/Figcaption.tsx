import Image from "next/image"

type Props = {
  src: string;
  caption?: string;
  alt: string;
};

export default function figcaption({ src, caption, alt }: Props) {
  if (caption !== undefined) {
    return (
      <figure>
        {/* <img src={src} alt={alt} /> */}
        <Image
          src={src}
          className=""
          width={100}
          height={100}
          alt={alt}
          quality={75}
          priority
        />
        <figcaption>{caption}</figcaption>
      </figure>
    );
  } else {
    // return <img src={src} alt={alt} />
    return <Image
          src={src}
          className=""
          width={100}
          height={100}
          alt={alt}
          quality={75}
          priority
        />
  }
}
