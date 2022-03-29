import Avatar from "boring-avatars";
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
      {avatarImage ? (
        <Image src={avatarImage} width={size} height={size} alt="Avatar" />
      ) : (
        <Avatar
          size={size}
          name={walletAddress}
          variant="pixel"
          colors={["#ffad08", "#edd75a", "#73b06f", "#0c8f8f", "#405059"]}
        />
      )}
      {children}
    </div>
  );
}
