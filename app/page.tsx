"use client";

import { useEffect, useState } from "react";
import { Plus, X, ShoppingBasket } from "lucide-react"; // アイコン
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion"; // アニメーション


interface ShoppingItem {
  id: number;
  title: string;
}

export default function Home() {
  const [items, setItems] = useState<ShoppingItem[]>([]); // 現在のリスト項目を格納する変数items
  const [newItem, setNewItem] = useState(""); // ユーザーが新たに追加しようとしているアイテムをnewItem
  const [showAddAnimation, setShowAddAnimation] = useState(false); // アイテム追加時に、アニメーションを表示するかどうかの状態管理
  const [selectedImage, setSelectedImage] = useState("");

  // 画像パスのリストを定義
  const images = [
    "/hatiware1.JPG",
    "/hatiware2.JPG",
    "/momonga.PNG",
    "/sanninn.JPG",
    "/sanninnde.JPG",
    "/si-sa-1.JPG",
    "/si-sa-2.JPG",
    "/si-sa-3.PNG",
    "/tiikawa1.JPG",
    "/tiikawa2.JPG",
    // 他の画像パスを追加
  ];

  // 画像パスのリストを定義
  const deleteImages = [
    "/otukare1.JPG",
    "/otukare2.PNG",
    "/otukare3.JPG",
    // 他の画像パスを追加
  ];

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/list', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error("Failed to fetch shopping list");
        }

        const data: ShoppingItem[] = await response.json();
        console.log("data is:", data);
        setItems(data);
      } catch (error) {
        console.error("Error fetching shopping list:", error);
      }
    };

    fetchItems();
  }, []);

  const addItem = async () => {
    if (!newItem.trim()) return;

    try {
      const response = await fetch("/api/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newItem.trim() }),
      });
      console.log("Request body:", { title: newItem.trim() });

      if (!response.ok) {
        throw new Error("Failed to add item");
      }

      const { data } = await response.json();
      console.log("POST data :", {data});
      

      // Supabase から返ってきたデータを使ってアイテムを更新
      setItems([...items, data[0]]);
      setNewItem("");

      // ランダムな画像を選択して状態にセット
      const randomImage = images[Math.floor(Math.random() * images.length)];
      setSelectedImage(randomImage);

      // アニメーションを開始
      setShowAddAnimation(true);
      setTimeout(() => setShowAddAnimation(false), 1500); // アニメーションの時間

    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const deleteItem = async (id: number) => {
    try {
      const response = await fetch("/api/list", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      setItems(items.filter(item => item.id !== id));

      // ランダムな画像を選択して状態にセット
      const randomDeleteImage = deleteImages[Math.floor(Math.random() * deleteImages.length)];
      setSelectedImage(randomDeleteImage);

      // アニメーションを開始
      setShowAddAnimation(true);
      setTimeout(() => setShowAddAnimation(false), 1500); // アニメーションの時間
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    // min-h-screen:画面の高さを少なくとも画面全体と同じにする
    // bg-gradient-to-b from-pink-50 to-white:背景に上から下にかけてのグラデーションを適用。薄いピンク (from-pink-50) から白 (to-white) に変化するグラデーション
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">

      {/* max-w-md:最大幅を設定し、中心に寄せる
      mx-auto:横方向に自動的にマージンを設定して中央揃え */}
      <div className="max-w-md mx-auto p-6">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-pink-600 mb-2 flex items-center justify-center gap-2">
            <ShoppingBasket className="w-8 h-8" />
            買い物リスト
          </h1>
        </div>

        <div className="relative">
          <div className="flex gap-2 mb-6">
            <Input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              // Enterキーを押すとaddItem起動
              onKeyPress={(e) => e.key === "Enter" && addItem()}
              placeholder="買うものは..."
              className="rounded-full bg-white border-pink-200 focus:border-pink-400 focus:ring-pink-400"
            />
            <Button
              onClick={addItem}
              className="rounded-full bg-pink-500 hover:bg-pink-600 text-white px-6"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          
          {/* アニメーションの実装 */}
          {/* AnimatePresenceは、コンポーネントのマウント、アンマウント時にアニメーションを付けたい所に使う
          // この中の要素が追加されたり削除されるとその動きにアニメーション付けれる */}
          <AnimatePresence>

            {/* // showAddAnimationがtrueの時は、motion.divがレンダリングされる */}
            {showAddAnimation && (

              // framer-motionでアニメーション効果を持つ特殊なdivタグ
              <motion.div
                // 以下のプロパティを設定できる
                // アニメーションの開始状態
                initial={{ 
                  scale: 0, // 要素が最初に表示されていない状態で始まる
                  opacity: 0 // 透明な状態で始まる
                }}
                // 要素が表示されるときにどんなアニメーションをするか定義
                animate={{ 
                  scale: 1, // 要素が元のサイズまで拡大する
                  opacity: 1 // 透明度を、完全に見える状態にする
                }}
                // 要素が削除されるときにどんなアニメーションを付けるか定義
                exit={{ 
                  scale: 0,
                  opacity: 0 
                }}
                // absolute:絶対位置を指定。-top-12は上から、right-0は右端
                // top-1/2: 親要素の高さの50%の位置（つまり中央）を基準
                // -translate-y-1/2: 要素自身の高さの50%だけ上に移動し、垂直方向に完全に中央に配置
                // -translate-x-1/2: 要素自身の幅の50%だけ左に移動し、水平方向に中央に配置
                // top-20: 上から5rem（80px）の位置
                // top-[15%]: 上から15%の位置に配置
                className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
              >

                {/* アイテム追加時にランダム選択された画像がアニメーション表示 */}
                <img
                  src={selectedImage}
                  alt="追加されたアイテム"
                  className="w-48 h-48"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>



        {/* リスト表示 */}
        <div className="space-y-3">
          <AnimatePresence>
            {/* items.length === 0なら、Add your first item!メッセージ */}
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-500 py-8"
              >
                買うもの 🛍️
              </motion.div>
            ) : (
              // listsを、mapで展開してリスト表示
              items.map((item) => (
                // 各itemを、motion.divでアニメーション付きで表示
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }} // 垂直方向に20ピクセル下にオフセットされた位置から始まる
                  animate={{ opacity: 1, y: 0 }} // 垂直方向のオフセットがない（元の位置）状態になる
                  exit={{ opacity: 0, x: -100 }} // リストから削除するとき。水平方向に左へ100ピクセル移動しながら消える
                  className={cn(
                    "flex items-center justify-between",
                    "bg-white rounded-xl p-4 shadow-sm",
                    "border border-pink-100"
                  )}
                >
                  <span className="text-gray-700">{item.title}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteItem(item.id)}
                    className="text-gray-400 hover:text-pink-500 hover:bg-pink-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}