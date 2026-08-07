export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl animate-pulse px-5 py-10 lg:px-8">
      <div className="h-20 rounded-xl bg-[#101821]" />
      <div className="mt-6 grid grid-cols-2 gap-2 lg:grid-cols-6">
        {Array.from({ length: 6 }, (_, index) => (
          <div className="h-28 rounded-xl bg-[#101821]" key={index} />
        ))}
      </div>
      <div className="mt-10 h-[520px] rounded-xl bg-[#101821]" />
    </main>
  );
}
