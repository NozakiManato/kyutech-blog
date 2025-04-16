"use client";
import { useEffect, useRef, useState } from "react";
import type EditorJS from "@editorjs/editorjs";
import type { API, EditorConfig } from "@editorjs/editorjs";
import { upload } from "@vercel/blob/client";

// EditorJS型定義
interface EditorJSOptions {
  holder: string;
  tools?: Record<string, unknown>;
  data?: EditorData;
  onChange?: (api: API, data: EditorData) => void;
  onReady?: () => void;
  autofocus?: boolean;
  placeholder?: string;
  i18n?: Record<string, unknown>;
}

interface EditorProps {
  onChange: (data: Record<string, unknown>) => void;
  initialData?: Record<string, unknown>;
  editorId?: string;
  placeholder?: string;
}

interface EditorData {
  blocks: Array<{
    type: string;
    data: Record<string, unknown>;
  }>;
}

export function Editor({
  onChange,
  initialData,
  editorId = "editorjs",
  placeholder = "内容を入力してください...",
}: EditorProps) {
  const editorRef = useRef<EditorJS | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // クライアントサイドでのみ実行
  useEffect(() => {
    setIsMounted(true);
    return () => {
      // クリーンアップ関数
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // EditorJSとプラグインを動的にインポート
    const initEditor = async () => {
      try {
        // EditorJSとプラグインを動的にインポート
        const EditorJS = (await import("@editorjs/editorjs")).default;
        const Header = (await import("@editorjs/header")).default;
        const List = (await import("@editorjs/list")).default;
        const Paragraph = (await import("@editorjs/paragraph")).default;
        const Embed = (await import("@editorjs/embed")).default;
        const Table = (await import("@editorjs/table")).default;
        const Code = (await import("@editorjs/code")).default;
        const LinkTool = (await import("@editorjs/link")).default;
        const DragDrop = (await import("editorjs-drag-drop")).default;
        const Marker = (await import("@editorjs/marker")).default;
        const AttachesTool = (await import("@editorjs/attaches")).default;
        const ImageTool = (await import("@editorjs/image")).default;

        // エディタが既に存在する場合は破棄
        if (editorRef.current) {
          editorRef.current.destroy();
        }

        // エディタの設定
        const options: EditorJSOptions = {
          holder: editorId,
          tools: {
            header: {
              class: Header,
              config: {
                levels: [2, 3, 4],
                defaultLevel: 2,
              },
            },
            list: {
              class: List,
              inlineToolbar: true,
            },
            paragraph: {
              class: Paragraph,
              inlineToolbar: true,
            },
            embed: {
              class: Embed,
              inlineToolbar: true,
              config: {
                services: {
                  youtube: true,
                  codesandbox: true,
                  facebook: true,
                  instagram: true,
                  twitter: true,
                  miro: true,
                },
              },
            },
            link: {
              class: LinkTool,
              config: {
                endpoint: "/api/posts/create",
              },
            },
            table: {
              class: Table,
              inlineToolbar: true,
            },
            code: {
              class: Code,
            },
            image: {
              class: ImageTool,
              inlineToolbar: true,
              config: {
                uploader: {
                  uploadByFile: async (file: File) => {
                    const newBlob = await upload(file.name, file, {
                      access: "public",
                      handleUploadUrl: `/api/posts/upload-file`,
                    });
                    if (!newBlob) {
                      return {
                        success: 0,
                        error: "ファイルのアップロードに失敗しました",
                      };
                    }
                    return {
                      success: 1,
                      file: {
                        url: newBlob.url,
                        name: file.name,
                        size: file.size,
                      },
                    };
                  },
                },
              },
            },
            marker: {
              class: Marker,
            },
            Attaches: {
              class: AttachesTool,
              config: {
                uploader: {
                  uploadByFile: async (file: File) => {
                    const newBlob = await upload(file.name, file, {
                      access: "public",
                      handleUploadUrl: `/api/posts/upload-file`,
                    });
                    if (!newBlob) {
                      return {
                        success: 0,
                        error: "ファイルのアップロードに失敗しました",
                      };
                    }
                    return {
                      success: 1,
                      file: {
                        url: newBlob.url,
                        name: file.name,
                        size: file.size,
                      },
                    };
                  },
                },
              },
            },
          },
          data: (initialData as unknown as EditorData) || {
            blocks: [
              {
                type: "paragraph",
                data: {
                  text: "",
                },
              },
            ],
          },
          onChange: async (api) => {
            const content = await api.saver.save();
            onChange(content as unknown as Record<string, unknown>);
          },
          onReady: () => {
            new DragDrop(editorRef.current);
          },
          autofocus: true,
          placeholder,
          i18n: {
            messages: {
              ui: {
                blockTunes: {
                  toggler: {
                    "Click to tune": "クリックして調整",
                    "or drag to move": "またはドラッグして移動",
                  },
                },
                inlineToolbar: {
                  converter: {
                    "Convert to": "変換",
                  },
                },
                toolbar: {
                  toolbox: {
                    Add: "追加",
                  },
                },
              },
              toolNames: {
                Text: "テキスト",
                Heading: "見出し",
                "Unordered List": "リスト",
                Warning: "警告",
                "Ordered List": "順序付きリスト",
                Checklist: "チェックリスト",
                Quote: "引用",
                Code: "コード",
                Delimiter: "区切り線",
                Table: "表",
                Link: "リンク",
                Marker: "マーカー",
                Bold: "太字",
                Italic: "斜体",
                Image: "画像",
                InlineCode: "インラインコード",
                Attachment: "ファイル",
              },
              tools: {
                warning: {
                  Title: "タイトル",
                  Message: "メッセージ",
                },
                link: {
                  "Add a link": "リンクを追加",
                },
                stub: {
                  "The block can not be displayed correctly.":
                    "このブロックは正しく表示できません。",
                },
              },
              blockTunes: {
                converter: {
                  "Convert to": "変換",
                },
                delete: {
                  Delete: "削除",
                },
                moveUp: {
                  "Move up": "上げる",
                },
                moveDown: {
                  "Move down": "下げる",
                },
              },
            },
          },
        };

        // エディタの初期化
        const editor = new EditorJS(options as unknown as EditorConfig);
        editorRef.current = editor;
      } catch (error) {
        console.error("Failed to load Editor.js:", error);
      }
    };

    initEditor();
  }, [editorId, initialData, isMounted, onChange, placeholder]);

  // エディタのコンテナ要素
  return (
    <div>
      <div id={editorId} className="min-h-[500px]" />
    </div>
  );
}
