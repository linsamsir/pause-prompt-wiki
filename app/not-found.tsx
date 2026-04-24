import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-6 py-20 text-center">
      <div className="stamp stamp-filled">404</div>
      <h1 className="font-serif-tc text-3xl font-semibold">此處無物</h1>
      <p className="text-sm text-muted-foreground">
        你尋找的頁面不存在。或許，也是一期一會。
      </p>
      <Link href="/" className="stamp">
        回首頁
      </Link>
    </div>
  );
}
