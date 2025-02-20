import type { Metadata } from "next";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import Header from "@/app/_components/Header";
import Footer from "@/app/_components/Footer";

export const metadata: Metadata = {
  title: "NextBlogApp",
  description: "Built to learn Next.js and modern web development.",
};

type Props = {
  children: React.ReactNode;
};

const RootLayout: React.FC<Props> = (props) => {
  const { children } = props;
  return (
    <html lang="ja">
      <body className="flex min-h-screen flex-col">
        <Header />
        <div className="mx-4 mt-2 max-w-4xl grow md:mx-[25vw]">{children}</div>
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
