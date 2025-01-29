'use client'

import { queryClient } from "@/lib/query";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}