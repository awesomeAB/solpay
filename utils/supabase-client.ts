import { createClient, User } from "@supabase/supabase-js";
import { ProductWithPrice, UserDetails, PaymentDetails, TransactionDetails } from "types";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
);

export const getActiveProductsWithPrices = async (): Promise<
  ProductWithPrice[]
> => {
  const { data, error } = await supabase
    .from("products")
    .select("*, prices(*)")
    .eq("active", true)
    .eq("prices.active", true)
    .order("metadata->index")
    .order("unit_amount", { foreignTable: "prices" });

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data || [];
};

export const updateUserName = async (user: User, name: string) => {
  await supabase
    .from<UserDetails>("users")
    .update({
      full_name: name,
    })
    .eq("id", user.id);
};

export const updateUserWallet = async (user: User, wallet: string) => {
  await supabase
    .from<UserDetails>("users")
    .update({
      wallet,
    })
    .eq("id", user.id);
};

export const insertPaymentDetails = async (paymentRow: any) => {
  const { error } =  await supabase.from<PaymentDetails>("payments").insert([paymentRow])
  if(error) throw error
}

export const getPaymentDetails = async (user: User) => {
  const {data, error } =  await supabase.from<PaymentDetails>("payments").select("*").eq("user_id", user.id)
  if(error) throw error
  return data
}

export const insertTransactionDetails = async (transactionRow: any) => {
  const { error } =  await supabase.from<TransactionDetails>("transactions").insert([transactionRow])
  if(error) throw error
}

export const getTransactionDetails = async (payment_id: string) => {
  const {data, error } =  await supabase.from<TransactionDetails>("transactions").select("*").eq("payment_id", payment_id)
  if(error) throw error
  return data
}

export const getIndividualPayment = async (id: string | any) => {
  const {data, error} = await supabase.from<PaymentDetails>("payments").select("*").eq("id", id)
  if(error) throw error
  return data
}