import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import React from "react";
export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1">
                <Header />
                <main>{children}</main>
            </div>
        </div>
    );
}