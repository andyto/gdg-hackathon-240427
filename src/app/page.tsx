"use client";
import Link from "next/link";
import { useAppStore } from "@/app/htp-test/_components/AppStore";

export default function Home() {
  const genId = useAppStore((state) => state.genId);

  return (
    <main>
      <h1>Welcome screen</h1>
      <Link
        href={"/htp-test"}
        onClick={() => {
          genId();
        }}
      >
        Click to start
      </Link>
    </main>
  );
}
