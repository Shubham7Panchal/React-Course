import { Header } from "../components/Header";

export function NotFoundPage({cart}) {
  return (
    <>
      <link
        rel="icon"
        type="image/svg+xml"
        href="src/assets/images/icons/nf.jpg"
      />
      <title>Error</title>
      <Header cart={cart}/>

      <div>Oops!!!Page not found</div>
    </>
  );
}
