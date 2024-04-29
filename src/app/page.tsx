import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>

      <h1>Welcome screen</h1>
      <Link href={'/htp-test'}>Click to start</Link>
    </main>
  );
}
