import Link from "next/link";

export function TableOfContents() {
  const sections = [
    { id: "basic-operations", title: "基本操作" },
    { id: "block-tools", title: "ブロックツールの使い方" },
    { id: "links-embeds", title: "リンクと埋め込みの違い" },
    { id: "images", title: "画像の追加" },
    { id: "file-attachments", title: "ファイルの添付" },
    { id: "block-management", title: "ブロックの移動・削除" },
    { id: "japanese-support", title: "日本語対応" },
    { id: "saving", title: "保存について" },
  ];
  return (
    <nav className="space-y-1">
      {sections.map((section) => (
        <Link
          key={section.id}
          href={`#${section.id}`}
          className="block py-2 px-3 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          {section.title}
        </Link>
      ))}
    </nav>
  );
}
