"use client";

import { useEffect, useState } from "react";
import { Plus, X, ShoppingBasket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ShoppingItem {
  id: string;
  name: string;
}

export default function Home() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItem, setNewItem] = useState("");
  const [showAddAnimation, setShowAddAnimation] = useState(false);

  const [lists, setLists] = useState([]);

  useEffect(() => {
    // ここから続き
  }, []);

  const addItem = () => {
    if (!newItem.trim()) return;
    
    const item = {
      id: Math.random().toString(36).substring(7),
      name: newItem.trim()
    };
    
    setItems([...items, item]);
    setNewItem("");
    setShowAddAnimation(true);
    setTimeout(() => setShowAddAnimation(false), 1000);
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-md mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-pink-600 mb-2 flex items-center justify-center gap-2">
            <ShoppingBasket className="w-8 h-8" />
            Shopping List
          </h1>
          <p className="text-gray-600">Keep track of your shopping items ✨</p>
        </div>

        <div className="relative">
          <div className="flex gap-2 mb-6">
            <Input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addItem()}
              placeholder="Add an item..."
              className="rounded-full bg-white border-pink-200 focus:border-pink-400 focus:ring-pink-400"
            />
            <Button
              onClick={addItem}
              className="rounded-full bg-pink-500 hover:bg-pink-600 text-white px-6"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <AnimatePresence>
            {showAddAnimation && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -top-12 right-0"
              >
                <span className="text-3xl">🌸</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-500 py-8"
              >
                Add your first item! 🛍️
              </motion.div>
            ) : (
              items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className={cn(
                    "flex items-center justify-between",
                    "bg-white rounded-xl p-4 shadow-sm",
                    "border border-pink-100"
                  )}
                >
                  <span className="text-gray-700">{item.name}</span>
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