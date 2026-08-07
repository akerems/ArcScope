import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-[70vh] max-w-xl place-items-center px-5 text-center">
      <div>
        <p className="eyebrow mb-4">Invalid address</p>
        <h1 className="text-3xl font-semibold">That address doesn&apos;t look right.</h1>
        <p className="mt-3 text-[#8294a3]">Use a valid 42-character EVM wallet or contract address.</p>
        <Link className="mt-7 inline-block rounded-lg bg-[#55f6b1] px-4 py-2.5 text-sm font-semibold text-[#06110c]" href="/">
          Back to search
        </Link>
      </div>
    </main>
  );
}
