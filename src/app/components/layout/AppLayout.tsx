import { ReactNode } from "react";
import { LanguageSwitcher } from "../ui/LanguageSwitcher.tsx";

interface Props {
  children: ReactNode;
}

export function AppLayout({ children }: Props) {
  return (
    <>
      {/* Global header – visible before login */}
      <header className="flex justify-end p-3 border-b bg-white">
        <LanguageSwitcher />
      </header>

      <main>{children}</main>
    </>
  );
}
