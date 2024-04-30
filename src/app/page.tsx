"use client";
import Link from "next/link";
import { useAppStore } from "@/app/htp-test/_components/AppStore";

export default function Home() {

  return (
    <main>
      <h1>Welcome screen</h1>
      <Link
        href={"/htp-test"}

      >
        Click to start
      </Link>
    </main>
  );
}
