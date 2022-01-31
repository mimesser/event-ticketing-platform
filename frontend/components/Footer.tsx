// import Image from "next/image"; // Images
import styles from "styles/components/Footer.module.scss"; // Component styles

/**
 * Links to render in footer
 * @dev Does not render any links where url is undefined, allowing conditional rendering
 */
// const footerLinks: { icon: string; url: string | undefined }[] = [
//   // Discord
//   { icon: "/icons/discord.svg", url: process.env.NEXT_PUBLIC_DISCORD },
//   // Twitter
//   { icon: "/icons/twitter.svg", url: process.env.NEXT_PUBLIC_TWITTER },
//   // Github
//   { icon: "/icons/github.svg", url: process.env.NEXT_PUBLIC_GITHUB },
// ];

export default function Footer() {
  return <div className={styles.footer}></div>;
}
