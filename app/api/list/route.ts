import { supabase } from "@/utils/supabase";


export async function GET(req: Request) {
  // Supabaseからショッピングリストを取得
  const { data, error } = await supabase
    .from('shopping')
    .select('*');

  if (error) {
    return new Response(JSON.stringify({ message: 'Failed to fetch shopping list', error }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(req: Request) {
    // 新しいアイテムを追加
    const { title } = await req.json();
  
    if (!title) {
      return new Response(JSON.stringify({ message: 'Item name is required' }), { status: 400 });
    }
  
    const { data, error } = await supabase
      .from('shopping')
      .insert([{ title }])
      .select('*'); // supabaseのinsertはデフォルトではinsertするだけでデータを返さないから、selectも必要
  
    if (error) {
      console.error('Supabase insert error:', error);
      return new Response(JSON.stringify({ message: 'Failed to add item', error }), { status: 500 });
    }
    console.log('Inserted data:', data); // 成功した場合もログを出力
  
    return new Response(JSON.stringify({ message: 'Item added successfully', data }), { status: 200 });
  }
  

export async function DELETE(req: Request) {
  // アイテムを削除
  const { id } = await req.json();

  if (!id) {
    return new Response(JSON.stringify({ message: 'Item ID is required' }), { status: 400 });
  }

  const { error } = await supabase
    .from('shopping')
    .delete()
    .eq('id', id);

  if (error) {
    return new Response(JSON.stringify({ message: 'Failed to delete item', error }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: 'Item deleted successfully' }), { status: 200 });
}
