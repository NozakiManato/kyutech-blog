"use client";

import { useEffect, useRef } from "react";

interface PostContentProps {
  content: any;
}

export function PostContent({ content }: PostContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !content || !content.blocks) return;

    const renderContent = async () => {
      try {
        // EditorJSのOutputデータをHTMLに変換
        const container = containerRef.current;
        container!.innerHTML = "";

        // 各ブロックをHTMLに変換
        content.blocks.forEach((block: any) => {
          const blockElement = document.createElement("div");
          blockElement.className = "mb-1";

          switch (block.type) {
            case "header":
              const headerLevel = block.data.level;
              const headerTag = document.createElement(`h${headerLevel}`);
              headerTag.innerHTML = block.data.text;
              headerTag.className = "font-bold mt-6 mb-1";
              if (headerLevel === 2) headerTag.className += " text-2xl";
              if (headerLevel === 3) headerTag.className += " text-xl";
              if (headerLevel === 4) headerTag.className += " text-lg";
              blockElement.appendChild(headerTag);
              break;

            case "paragraph":
              const p = document.createElement("p");
              p.innerHTML = block.data.text;
              p.className = "mb-1";
              blockElement.appendChild(p);
              break;

            case "list":
              const listTag = block.data.style === "ordered" ? "ol" : "ul";
              const list = document.createElement(listTag);
              list.className =
                block.data.style === "ordered"
                  ? "list-decimal pl-5"
                  : "list-disc pl-5";

              block.data.items.forEach((item: string) => {
                const li = document.createElement("li");
                li.innerHTML = item;
                list.appendChild(li);
              });

              blockElement.appendChild(list);
              break;

            case "code":
              const pre = document.createElement("pre");
              pre.className =
                "bg-muted text-inherit  p-2 rounded-md overflow-x-auto";
              const code = document.createElement("code");
              code.textContent = block.data.code;
              pre.appendChild(code);
              blockElement.appendChild(pre);
              break;

            case "table":
              const table = document.createElement("table");
              table.className = "w-full border-collapse border border-border";

              // テーブルヘッダー
              if (block.data.withHeadings) {
                const thead = document.createElement("thead");
                const headerRow = document.createElement("tr");

                block.data.content[0].forEach((cell: string) => {
                  const th = document.createElement("th");
                  th.innerHTML = cell;
                  th.className = "border border-border p-2 bg-muted";
                  headerRow.appendChild(th);
                });

                thead.appendChild(headerRow);
                table.appendChild(thead);

                // ヘッダー行を除外
                block.data.content.shift();
              }

              // テーブル本体
              const tbody = document.createElement("tbody");

              block.data.content.forEach((row: string[]) => {
                const tr = document.createElement("tr");

                row.forEach((cell: string) => {
                  const td = document.createElement("td");
                  td.innerHTML = cell;
                  td.className = "border border-border p-2";
                  tr.appendChild(td);
                });

                tbody.appendChild(tr);
              });

              table.appendChild(tbody);
              blockElement.appendChild(table);
              break;

            case "embed":
              if (block.data.service === "youtube") {
                const iframe = document.createElement("iframe");
                iframe.src = `https://www.youtube.com/embed/${block.data.embed}`;
                iframe.className = "w-full aspect-video rounded-md";
                iframe.allowFullscreen = true;
                blockElement.appendChild(iframe);
              } else if (block.data.service === "codesandbox") {
                const iframe = document.createElement("iframe");
                iframe.src = `https://codesandbox.io/embed/${block.data.embed}`;
                iframe.className = "w-full h-96 rounded-md";
                iframe.allowFullscreen = true;
                blockElement.appendChild(iframe);
              } else {
                const a = document.createElement("a");
                a.href = block.data.embed;
                a.textContent = block.data.caption || block.data.embed;
                a.className = "text-primary underline";
                a.target = "_blank";
                a.rel = "noopener noreferrer";
                blockElement.appendChild(a);
              }
              break;

            // 単純なテキストの場合（旧形式との互換性のため）
            case "text":
              const textP = document.createElement("p");
              textP.innerHTML = block.data.text;
              textP.className = "mb-1";
              blockElement.appendChild(textP);
              break;

            default:
              // 未知のブロックタイプの場合はJSONを表示
              if (block.data && block.data.text) {
                const defaultP = document.createElement("p");
                defaultP.innerHTML = block.data.text;
                blockElement.appendChild(defaultP);
              } else {
                const pre = document.createElement("pre");
                pre.textContent = JSON.stringify(block.data, null, 2);
                pre.className = "text-xs bg-muted p-2 rounded";
                blockElement.appendChild(pre);
              }
          }

          container?.appendChild(blockElement);
        });
      } catch (error) {
        console.error("Error rendering EditorJS content:", error);

        // エラーが発生した場合は単純なテキスト表示にフォールバック
        if (containerRef.current) {
          const fallbackText =
            content.blocks?.find(
              (block: any) => block.type === "paragraph" && block.data.text
            )?.data.text || "内容を表示できません";

          containerRef.current.innerHTML = `<p>${fallbackText}</p>`;
        }
      }
    };

    renderContent();
  }, [content]);

  // 単純なテキストの場合のフォールバック
  if (!content || !content.blocks) {
    const textContent =
      typeof content === "string"
        ? content
        : content?.text || "内容がありません";

    return <div className="whitespace-pre-line">{textContent}</div>;
  }

  return (
    <div
      ref={containerRef}
      className="prose prose-lg leading-tight max-w-none dark:prose-invert"
    />
  );
}
