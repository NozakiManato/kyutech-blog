"use client";
import { useEffect, useRef, useState } from "react";

// EditorJS型定義
interface EditorJSOptions {
  holder: string;
  tools?: Record<string, any>;
  data?: any;
  onChange?: (api: any, data: any) => void;
  onReady?: any;
  autofocus?: boolean;
  placeholder?: string;
  i18n?: Record<string, any>;
}

interface EditorProps {
  onChange: (data: any) => void;
  initialData?: any;
  editorId?: string;
  placeholder?: string;
}

export function Editor({
  onChange,
  initialData,
  editorId = "editorjs",
  placeholder = "内容を入力してください...",
}: EditorProps) {
  const editorRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
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
      setIsLoading(true);

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
                endpoints: {
                  byFile: "/api/posts/upload-image",
                  byUrl: "/api/posts/fetch-url",
                },
                field: "image",
                types: "image/*",
              },
            },
            marker: {
              class: Marker,
            },
            Attaches: {
              class: AttachesTool,
              config: {
                endpoint: "/api/posts/upload-file",
                uploader: {
                  uploadByFile(file: File) {
                    const formData = new FormData();
                    formData.append("file", file);

                    return fetch("/api/posts/upload-file", {
                      method: "POST",
                      body: formData,
                    })
                      .then((response) => response.json())
                      .then((result) => {
                        return {
                          success: 1,
                          file: {
                            url: result.file.url,
                            name: result.file.name,
                            size: result.file.size,
                          },
                        };
                      })
                      .catch((error) => {
                        console.error("Error uploading file:", error);
                        return {
                          success: 0,
                          error,
                        };
                      });
                  },
                },
              },
            },
          },
          data: initialData || {
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
            onChange(content);
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
        const editor = new EditorJS(options);
        editorRef.current = editor;

        // エディタの準備完了を待つ
        editor.isReady
          .then(() => {
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Editor.js initialization failed:", error);
            setIsLoading(false);
          });
      } catch (error) {
        console.error("Failed to load Editor.js:", error);
        setIsLoading(false);
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
