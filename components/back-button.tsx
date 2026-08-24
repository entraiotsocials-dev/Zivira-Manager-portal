"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton({ fallback = "/admin/home" }: { fallback?: string }) {
  const router = useRouter();

  return (
    <button
      className="button button-secondary"
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
          return;
        }

        router.push(fallback);
      }}
      type="button"
    >
      <ArrowLeft size={17} />
      Back
    </button>
  );
}
