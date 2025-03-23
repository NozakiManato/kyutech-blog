"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

// EditorJS型定義
interface EditorJSOptions {
  holder: string;
  tools?: Record<string, any>;
  data?: any;
  onChange?: (api: any, data: any) => void;
  autofocus?: boolean;
  placeholder?: string;
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
        const InlineCode = (await import("@editorjs/raw")).default;
        const Marker = (await import("@editorjs/marker")).default;

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
                },
              },
            },
            table: {
              class: Table,
              inlineToolbar: true,
            },
            code: {
              class: Code,
            },
            inlineCode: {
              class: InlineCode,
            },
            marker: {
              class: Marker,
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
          onChange: async (api, data) => {
            const content = await api.saver.save();
            onChange(content);
          },
          autofocus: true,
          placeholder,
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
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <div
        id={editorId}
        className="prose prose-sm sm:prose max-w-none dark:prose-invert min-h-[200px]"
      />
    </div>
  );
}
