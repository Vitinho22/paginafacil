"use client";

import { ReactNode } from "react";
import Providers from "@/app/providers";
import Protected from "@/components/Protected";
import DashboardShell from "@/components/DashboardShell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <Protected>
        <DashboardShell>{children}</DashboardShell>
      </Protected>
    </Providers>
  );
}
