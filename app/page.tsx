"use client";
import Header from "@/components/header/Header";
import Example from "../components/header";
import Product from "./product";

export default function Home() {
  return (
    <>
      <div className="container mx-auto mb-12 px-2 ">
        {/* <Category /> */}
        <Product />
      </div>
    </>
  );
}
