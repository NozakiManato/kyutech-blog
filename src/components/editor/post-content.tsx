"use client";

import React from "react";
import EditorJSHTML from "editorjs-html";

// カスタムパーサーを作成
const customParsers = {
  // linkブロック用のカスタムパーサー（linkToolではなくlink）
  link: (block) => {
    const { link, meta } = block.data;

    if (!link) return "";

    // メタデータがない場合はシンプルなリンクを返す
    if (!meta) {
      return `<a href="${link}" target="_blank" rel="noopener noreferrer" class="text-primary underline">${link}</a>`;
    }

    // リンクカードのHTMLを構築
    const title = meta.title
      ? `<h3 class="font-bold text-lg mb-2">${meta.title}</h3>`
      : "";
    const description = meta.description
      ? `<p class="text-sm text-muted-foreground line-clamp-2 mb-2">${meta.description}</p>`
      : "";

    const domain = meta.site_name || meta.domain || new URL(link).hostname;
    const domainHTML = `
      <div class="text-xs text-muted-foreground flex items-center mt-2">
        <img src="https://www.google.com/s2/favicons?domain=${link}" class="w-4 h-4 mr-1" alt="" />
        <span>${domain}</span>
      </div>
    `;

    // 画像部分（オプション）
    let imageHTML = "";
    if (meta.image && meta.image.url) {
      imageHTML = `
        <div class="overflow-hidden">
          <img 
            src="${meta.image.url}" 
            alt="${meta.title || "Link preview"}" 
            class="object-cover"
            onerror="this.parentNode.style.display='none'"
            width="200" height="200"
          />
        </div>
      `;
    }

    return `
      <div class="border rounded-md overflow-hidden mb-4">
        <a href="${link}" target="_blank" rel="noopener noreferrer" class="container flex hover:bg-muted/50 transition-colors">

        <div class="p-4">
        ${title}
        ${description}
        ${domainHTML}
        </div>
        ${imageHTML}

        </a>
      </div>
    `;
  },

  // tableブロック用のカスタムパーサー
  table: (block) => {
    const { content, withHeadings } = block.data;

    if (!content || !content.length) return "";

    let tableHTML =
      '<table class="w-full border-collapse border border-border mb-4">';

    // テーブルヘッダー（withHeadingsがtrueの場合）
    if (withHeadings && content.length > 0) {
      tableHTML += "<thead>";
      tableHTML += "<tr>";

      content[0].forEach((cell) => {
        tableHTML += `<th class="border border-border p-2 bg-muted">${cell}</th>`;
      });

      tableHTML += "</tr>";
      tableHTML += "</thead>";

      // ヘッダー行を除外
      content.shift();
    }

    // テーブル本体
    tableHTML += "<tbody>";

    content.forEach((row) => {
      tableHTML += "<tr>";

      row.forEach((cell) => {
        tableHTML += `<td class="border border-border p-2">${cell}</td>`;
      });

      tableHTML += "</tr>";
    });

    tableHTML += "</tbody>";
    tableHTML += "</table>";

    return tableHTML;
  },
};

// カスタムパーサーを含むeditorjs-htmlパーサーを作成
const edjsParser = EditorJSHTML({
  link: customParsers.link, // linkに変更
  table: customParsers.table,
});

export function PostContent({ data }) {
  // データがない場合のフォールバック
  if (!data || !data.blocks || data.blocks.length === 0) {
    return <div className="text-muted">内容がありません</div>;
  }

  // デバッグ用：ブロックタイプを確認
  console.log(
    "Block types:",
    data.blocks.map((block) => block.type)
  );

  // HTMLに変換
  const html = edjsParser.parse(data);

  // 安全にHTMLを表示するためのコンポーネント
  const HTMLContent = ({ htmlString }) => {
    return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
  };

  return (
    <div className="text-container prose-lg max-w-none dark:prose-invert">
      {/* htmlが配列の場合はmapを使用し、文字列の場合は直接表示 */}
      {Array.isArray(html) ? (
        html.map((htmlString, index) => (
          <HTMLContent key={index} htmlString={htmlString} />
        ))
      ) : (
        <HTMLContent htmlString={html} />
      )}
    </div>
  );
}
