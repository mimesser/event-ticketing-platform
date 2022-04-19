import Image from "next/image";

export default function Preview({
  avatarImage,
  walletAddress,
  size,
  rounded = true,
  style,
  id,
  onClick,
  children,
}: {
  avatarImage?: string;
  walletAddress: string;
  size: number;
  rounded?: boolean;
  style?: object;
  id?: any;
  onClick?: any;
  children?: any;
}) {
  const imgSrc = avatarImage
    ? avatarImage
    : `https://source.boringavatars.com/pixel/${size}/${walletAddress}?colors=ffad08,edd75a,73b06f,0c8f8f,405059`;
  return (
    <div
      style={{
        borderRadius: rounded ? "50%" : "none",
        width: size,
        height: size,
        overflow: "hidden",
        position: "relative",
        ...style,
      }}
      id={id}
      onClick={onClick}
    >
      <Image src={imgSrc} width={size} height={size} alt="Avatar" />
      {children}
    </div>
  );
}
