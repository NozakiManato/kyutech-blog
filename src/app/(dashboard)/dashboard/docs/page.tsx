import { EditorJsManual } from "@/components/dashboard/docs/editorjs-manual";
import { TableOfContents } from "@/components/dashboard/docs/table-of-contents";

export default function DocsPage() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      <div className="lg:w-1/4 p-4 lg:p-6 border-r">
        <div className="sticky top-6">
          <h2 className="text-2xl font-bold mb-4">🧭 目次</h2>
          <TableOfContents />
        </div>
      </div>
      <main className="flex-1 p-4 lg:p-6 max-w-4xl">
        <EditorJsManual />
      </main>
    </div>
  );
}
