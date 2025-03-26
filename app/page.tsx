"use client";
import { DarkThemeToggle } from "flowbite-react";
import Category from "../components/category";
import Example from "../components/header";
import Product from "./product";

export default function Home() {
  return (
    <>
      <Example />
      <div className="container mx-auto mb-12 px-2 pt-28">
        {/* <Category /> */}
        <Product />
        <main className="flex min-h-screen items-center justify-center gap-2 dark:bg-gray-800">
          {/* <h1 className="text-2xl dark:text-white">Flowbite React + Next.js</h1>
        <DarkThemeToggle /> */}
        </main>
      </div>
    </>
  );
}
