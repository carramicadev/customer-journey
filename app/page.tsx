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
      </div>
    </>
  );
}
