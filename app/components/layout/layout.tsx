import Header from "./header";
import Footer from "./footer";
import type { PropsWithChildren } from "react";

export function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

// import * as React from "react";

// const layout = (children: React.ReactNode) => (
//   <>
//     <Header />
//     {children}
//     <Footer />
//   </>
// );

// export default layout;
