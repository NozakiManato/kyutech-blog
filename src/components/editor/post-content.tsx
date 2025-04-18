"use client";
import EditorJSHTML from "editorjs-html";
import * as ReactDOMServer from "react-dom/server";
import { Icon } from "../icons/icon";

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
};

// ファイル拡張子からアイコンクラスを取得する関数
const getFileIconComponent = (extension) => {
  const iconMap = {
    pdf: Icon.pdf,
    doc: Icon.word,
    docx: Icon.word,
    xls: Icon.excel,
    xlsx: Icon.excel,
    ppt: Icon.powerpoint,
    pptx: Icon.powerpoint,
    zip: Icon.zip,
    rar: Icon.zip,
    "7z": Icon.zip,
    txt: Icon.text,
    jpg: Icon.image,
    jpeg: Icon.image,
    png: Icon.image,
    gif: Icon.image,
    mp3: Icon.audio,
    wav: Icon.audio,
    mp4: Icon.video,
    avi: Icon.video,
    mov: Icon.video,
  };

  const ext = extension.toLowerCase();
  return iconMap[ext] || Icon.file;
};

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
  // Attachesブロック用のカスタムパーサー
  attaches: (block) => {
    const { file } = block.data;

    if (!file || !file.url) return "";

    const fileName = file.name || "ファイル";
    const fileSize = file.size ? formatFileSize(file.size) : "";
    const fileExtension = file.extension || fileName.split(".").pop() || "";
    const IconComponent = getFileIconComponent(fileExtension);

    return `
      <div class="border rounded-md p-4 mb-4 flex items-center hover:bg-muted/50 transition-colors">
        <div class="mr-4 text-2xl text-muted-foreground">
          ${ReactDOMServer.renderToString(<IconComponent />)}
        </div>
        <div class="flex-1">
          <a href="${
            file.url
          }" download="${fileName}" class="font-medium text-primary hover:underline">
            ${fileName}
          </a>
          <div class="text-xs text-muted-foreground mt-1">
            ${fileExtension.toUpperCase()} ${fileSize ? `• ${fileSize}` : ""}
          </div>
        </div>
        <a href="${
          file.url
        }" download="${fileName}" class="ml-4 p-2 rounded-full hover:bg-muted">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="download">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </a>
      </div>
    `;
  },

  // Listブロック用のカスタムパーサー
  list: (block) => {
    const { style, items } = block.data;

    if (!items || !items.length) return "";

    const listType = style === "ordered" ? "ol" : "ul";
    const listClass =
      style === "ordered"
        ? "list-decimal pl-5 mb-4 space-y-1"
        : "list-disc pl-5 mb-4 space-y-1";

    // リストアイテムを再帰的に処理する関数
    const processItems = (items) => {
      let html = `<${listType} class="${listClass}">`;

      items.forEach((item) => {
        if (typeof item === "string") {
          html += `<li>${item}</li>`;
        } else if (typeof item === "object") {
          // 文字列とネストされたリストの両方を持つアイテム
          html += `<li>${item.content}`;

          if (item.items && item.items.length) {
            html += processItems(item.items);
          }

          html += "</li>";
        }
      });

      html += `</${listType}>`;
      return html;
    };

    return processItems(items);
  },

  // Codeブロック用のカスタムパーサー
  code: (block) => {
    const { code, language } = block.data;

    if (!code) return "";

    const languageLabel = language
      ? `<div class="text-xs text-right px-4 py-1 bg-muted border-t border-l border-r rounded-t-md border-border">${language}</div>`
      : "";

    return `
      <div class="mb-4">
        ${languageLabel}
        <pre class="bg-muted p-4 overflow-x-auto rounded-md ${
          language ? "rounded-t-none" : ""
        } border border-border"><code class="language-${
      language || "plaintext"
    }">${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
      </div>
    `;
  },
  image: (block) => {
    const { file, caption, withBorder, withBackground } = block.data;

    if (!file || !file.url) return "";

    // 一意のIDを生成して、複数の画像が存在する場合にも対応
    const modalId = `image-modal-${block.id}`;

    return `
      <div class="flex justify-center items-center mb-4">
        <div class="w-[300px] h-[300px] overflow-hidden flex items-center justify-center border ${
          withBorder ? "border-border" : ""
        } ${withBackground ? "bg-muted" : ""}" 
        data-fullsrc="${file.url}" 
        onclick="document.getElementById('${modalId}').style.display = 'flex';"
        style="cursor: zoom-in;">
          <img src="${file.url}" alt="${
      caption || "Image"
    }" class="object-cover w-[300px] h-[300px]" onerror="this.style.display='none'" />
        </div>
      </div>
      ${
        caption
          ? `<p class="text-center text-sm text-muted-foreground mt-2">${caption}</p>`
          : ""
      }
      
      <!-- 埋め込みモーダル -->
      <div id="${modalId}" 
        class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" 
        style="display: none;"
        onclick="this.style.display = 'none';">
        <img
          src="${file.url}"
          alt="${caption || "Full view"}"
          class="max-w-full max-h-full rounded-lg shadow-lg"
          onclick="event.stopPropagation();"
        />
      </div>
    `;
  },
};

// カスタムパーサーを含むeditorjs-htmlパーサーを作成
const edjsParser = EditorJSHTML({
  link: customParsers.link, // linkに変更
  table: customParsers.table,
  attaches: customParsers.attaches,
  Attaches: customParsers.attaches,
  list: customParsers.list,
  code: customParsers.code,
  image: customParsers.image,
});

export function PostContent({ data }) {
  // データがない場合のフォールバック
  if (!data || !data.blocks || data.blocks.length === 0) {
    return <div className="text-muted">内容がありません</div>;
  }

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
