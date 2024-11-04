import { supabase } from "./supabase"

export const getAllList = async () => {
    const lists = await supabase.from("shopping").select("*");
    return lists.data;
};