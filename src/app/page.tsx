import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-row justify-around font-bold ">
      <Link href="/templates">
        <h1 className=" text-bold uppercase">Templates</h1>
      </Link>

      <Link href="/features">
        <h1 className=" text-bold uppercase">Features</h1>
      </Link>

      <Link href="/reports">
        <h1 className=" text-bold uppercase">Report</h1>
      </Link>

      <Link href="/product">
        <h1 className=" text-bold uppercase">Product</h1>
      </Link>

      <Link href="/blog">
        <h1 className=" text-bold uppercase">Blog</h1>
      </Link>
    </div>
  );
}
