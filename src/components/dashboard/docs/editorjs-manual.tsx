import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InfoIcon } from "lucide-react";

export function EditorJsManual() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold">
          📝Editor.js 利用マニュアル（利用者向け）
        </h1>
        <p className="text-lg text-muted-foreground">
          Editor.jsは、直感的で自由度の高いブロック型エディタです。このマニュアルでは、実際にエディタを使う人の視点で、操作方法・使える機能・活用のコツを詳しく説明します。
        </p>
      </section>

      <section id="basic-operations" className="space-y-4 scroll-mt-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-green-500">✅</span>基本操作
        </h2>
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-3">✍ テキスト入力</h3>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                編集画面の「投稿の内容を入力...」と書かれた部分をクリック。
              </li>
              <li>そのまま文章を入力できます。</li>
              <li>Enterキーで新しい段落が追加されます。</li>
            </ul>
          </CardContent>
        </Card>
      </section>
      <section id="block-tools" className="space-y-4 scroll-mt-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-blue-500">🧰</span> ブロックツールの使い方
        </h2>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                新しい行にカーソルを合わせると「＋」ボタンが表示されます。
              </li>
              <li>「＋」をクリックするとツール一覧が表示されます。</li>
              <li>任意のブロック（例：見出し、画像、表など）を選択します。</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              使用可能な代表的なブロック：
            </h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ツール名</TableHead>
                    <TableHead>用途</TableHead>
                    <TableHead>特徴</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>リンク</TableCell>
                    <TableCell>記事への参照用リンクを挿入</TableCell>
                    <TableCell>タイトル・画像・説明文が自動で表示</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>テキスト</TableCell>
                    <TableCell>通常の本文入力</TableCell>
                    <TableCell>基本的なテキスト記述</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>見出し</TableCell>
                    <TableCell>セクションタイトル作成</TableCell>
                    <TableCell>レベル2〜4の大きさ調整可</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>リスト</TableCell>
                    <TableCell>箇条書き・番号付きリスト</TableCell>
                    <TableCell>Markdown的使い方も可能</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>表</TableCell>
                    <TableCell>表データの入力</TableCell>
                    <TableCell>Excel的な2D表を入力</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>コード</TableCell>
                    <TableCell>ソースコードの記述</TableCell>
                    <TableCell>プログラミング言語に対応</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>画像</TableCell>
                    <TableCell>写真・画像の挿入</TableCell>
                    <TableCell>ファイル選択で自動アップロード</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>ファイル</TableCell>
                    <TableCell>PDFやExcelなどの添付</TableCell>
                    <TableCell>読者がダウンロードできる</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>
      <section id="links-embeds" className="space-y-4 scroll-mt-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-purple-500">🌐</span> リンクと埋め込みの違い
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-3">
                🔗 リンク（Link Tool）
              </h3>
              <p className="mb-3">
                記事やWebページへの参照用リンクを挿入します。
              </p>

              <h4 className="font-medium mt-4 mb-2">使い方：</h4>
              <ul className="space-y-2 list-disc list-inside">
                <li>「＋」→「リンク」を選択</li>
                <li>
                  任意のURLを貼り付けると、タイトル・画像・説明文が自動で表示されます
                </li>
              </ul>

              <p className="mt-4 text-green-600 font-medium">
                ✅ 推奨用途：ニュース記事やブログ、製品紹介ページなどへのリンク
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-3">
                📺 埋め込み（Embed Tool）
              </h3>
              <p className="mb-3">
                YouTube動画などのコンテンツを画面内に表示したいときに使います。
              </p>

              <h4 className="font-medium mt-4 mb-2">対応サービスの例：</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>YouTube</li>
                <li>CodeSandbox</li>
                <li>Twitter（X）</li>
                <li>Instagram</li>
                <li>Facebook</li>
              </ul>

              <h4 className="font-medium mt-4 mb-2">使い方：</h4>
              <ul className="space-y-2 list-disc list-inside">
                <li>投稿の内容を入力...」と書かれた部分にリンクを貼り付ける</li>
                <li>
                  対応サービスのURL（例：https://www.youtube.com/watch?v=abc123）を貼り付ける
                </li>
              </ul>

              <Alert className="mt-4 bg-amber-50 border-amber-200">
                <InfoIcon className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  ⚠
                  YouTubeなどの動画は「Link」ではなく「Embed」を使用してください！
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="images" className="space-y-4 scroll-mt-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-indigo-500">🖼️</span> 画像の追加
        </h2>
        <Card>
          <CardContent className="pt-6">
            <ul className="space-y-2 list-disc list-inside">
              <li>「＋」→「画像（Image）」を選択</li>
              <li>PC内の画像ファイルを選んでアップロード</li>
              <li>自動で画像が表示されます</li>
            </ul>

            <Alert className="mt-4 bg-blue-50 border-blue-200">
              <InfoIcon className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                🔒 アップロードされた画像はインターネット上で公開されます
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </section>

      <section id="file-attachments" className="space-y-4 scroll-mt-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-orange-500">📎</span>{" "}
          ファイルの添付（PDFやExcelなど）
        </h2>
        <Card>
          <CardContent className="pt-6">
            <ul className="space-y-2 list-disc list-inside">
              <li>「＋」→「ファイル（Attachment）」を選択</li>
              <li>任意のファイル（PDF, XLSX など）を選択</li>
              <li>エディタ上にファイル名・リンクが表示されます</li>
              <li>読者はファイル名をクリックしてダウンロードできます。</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section id="block-management" className="space-y-4 scroll-mt-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-rose-500">🔃</span> ブロックの移動・削除
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-3">🔀 移動</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>ブロックの左にカーソルを合わせると「︙」が表示されます</li>
                <li>それをドラッグして上下に移動できます</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-3">🗑 削除</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>各ブロック右上の「︙」メニューをクリック</li>
                <li>「削除」を選択するとブロックが削除されます</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="japanese-support" className="space-y-4 scroll-mt-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-red-500">🈲</span> 日本語対応
        </h2>
        <Card>
          <CardContent className="pt-6">
            <p className="mb-3">
              すべてのUI、ボタン、ツール名が完全に日本語化されています。
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                「＋」メニュー →「見出し」「表」「ファイル」など日本語で表示
              </li>
              <li>
                ツールバーや操作メッセージも全て日本語なので直感的に使えます
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section id="saving" className="space-y-4 scroll-mt-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-emerald-500">💾</span> 保存について
        </h2>
        <Card>
          <CardContent className="pt-6">
            <ul className="space-y-2 list-disc list-inside">
              <li>入力・編集内容はリアルタイムで保存されます</li>
              <li>編集中に「保存ボタン」を押す必要はありません</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">📌 補足</h3>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                編集した内容はブラウザで保持されるわけではないため、離れるときは送信完了後に画面を離れてください。
              </li>
              <li>
                アップロードされた画像やファイルはVercel経由でクラウド保存されます。
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
