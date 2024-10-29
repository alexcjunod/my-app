import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import "./globals.css";

export const metadata: Metadata = {
  title: "SMART Goal Setting",
  description: "Set and track your SMART goals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        signIn: { mounted: { mode: "modal" } },
        elements: {
          formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
          card: 'bg-background',
          headerTitle: 'text-foreground',
          headerSubtitle: 'text-muted-foreground',
          socialButtonsBlockButton: 'bg-background border border-input text-foreground hover:bg-accent hover:text-accent-foreground',
          footerActionLink: 'text-primary hover:text-primary/90',
          formFieldLabel: 'text-foreground',
          formFieldInput: 'bg-background text-foreground',
        }
      }}
    >
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
