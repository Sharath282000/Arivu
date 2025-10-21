import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arivu: AI Chatbot, Smart Assistant & Conversational Tool",
  description: "Arivu - An AI powered ChatBot",
  keywords: ['Arivu', 'AI', 'ChatBot', 'Vercel', 'smart assistant', 'conversational AI', 'AI tool','Arivu AI-Powered Chatbot Assistant'],
  openGraph:{
    title: "Arivu: Your AI-Powered Chatbot Assistant",
      description: "Arivu is a modern, fast AI chatbot built on Vercel. Get instant, accurate answers and smart conversation features right from your browser.",
      url: 'https://arivu-ai.vercel.app/',
      siteName: 'Arivu AI ChatBot',
      images: ['https://arivu-ai.vercel.app/_next/image?url=%2FLogo.png&w=96&q=75']
  },
  twitter: {
        card: 'summary_large_image', 
        title: "Arivu: Your AI-Powered Chatbot Assistant",
        description: "Arivu is a modern, fast AI chatbot. Get instant, accurate answers and smart conversation features right from your browser.",
        images: ['https://arivu-ai.vercel.app/_next/image?url=%2FLogo.png&w=96&q=75'],
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme="light" attribute='class' disableTransitionOnChange>
          <div className="p-5">
            <Navbar />
            {children}
            <Toaster richColors position="top-center"/>
            <Footer/>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
