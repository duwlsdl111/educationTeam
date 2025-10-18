import Image from "next/image";
import styles from "./page.module.css";

import Header from "./components/Header/page"
import Footer from "./components/Footer/page"
import Edu from "./edu/page"
import Edudetail from "./edudetail/page"

export default function Home() {
  return (
    <div>
      <Header />
      {/* <Edu /> */}
      <Edudetail />
      <Footer />
    </div>
  );
}
