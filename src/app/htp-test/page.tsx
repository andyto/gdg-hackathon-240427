"use client";

import { useAppStore } from "@/app/htp-test/_components/AppStore";
import Step1 from "@/app/htp-test/_components/Step1";

export default function HtpTest() {
  const stage = useAppStore((state) => state.stage);

  return (
    <main>
      <h1>HtpTest</h1>
      {stage === 1 && <Step1 />}
    </main>
  );
}
