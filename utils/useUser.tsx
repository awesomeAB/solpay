import { useEffect, useState, createContext, useContext } from "react";
import { supabase } from "./supabase-client";
import {
  Session,
  User,
  Provider,
  AuthChangeEvent,
} from "@supabase/supabase-js";
import { UserDetails } from "types";
import { Subscription } from "types";

type UserContextType = {
  session: Session;
  user: User;
  userDetails: UserDetails;
  userLoaded: boolean;
  subscription: Subscription;
  signIn: (options: SignInOptions) => Promise<{
    session: Session | null;
    user: User | null;
    provider?: Provider;
    url?: string | null;
    error: Error | null;
    data: Session | null;
  }>;
  signUp: (options: SignUpOptions) => Promise<{
    user: User | null;
    session: Session | null;
    error: Error | null;
    data: Session | User | null;
  }>;
  signOut: () => void;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export const UserContextProvider = (props: any) => {
  const [userLoaded, setUserLoaded] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    const session = supabase.auth.session();
    setSession(session);
    setUser(session?.user ?? null);
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        updateSupabaseCookie(event, session);
      },
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const getUserDetails = () =>
    supabase.from<UserDetails>("users").select("*").single();
  const getSubscription = () =>
    supabase
      .from<Subscription>("subscriptions")
      .select("*, prices(*, products(*))")
      .in("status", ["trialing", "active"])
      .single();

  useEffect(() => {
    if (user) {
      Promise.allSettled([getUserDetails(), getSubscription()]).then(
        (results) => {
          const userDetailsPromise = results[0];
          const subscriptionPromise = results[1];

          if (userDetailsPromise.status === "fulfilled")
            setUserDetails(userDetailsPromise.value.data);

          if (subscriptionPromise.status === "fulfilled")
            setSubscription(subscriptionPromise.value.data);

          setUserLoaded(true);
        },
      );
    }
  }, [user]);

  async function updateSupabaseCookie(
    event: AuthChangeEvent,
    session: Session | null,
  ) {
    await fetch("/api/auth", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: "same-origin",
      body: JSON.stringify({ event, session }),
    });
  }

  const value = {
    session,
    user,
    userDetails,
    userLoaded,
    subscription,
    signIn: (options: SignInOptions) => supabase.auth.signIn(options),
    signUp: (options: SignUpOptions) => supabase.auth.signUp(options),
    signOut: () => {
      setUserDetails(null);
      setSubscription(null);
      return supabase.auth.signOut();
    },
  };

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`);
  }
  return context;
};

type SignInOptions = {
  email?: string;
  password?: string;
  provider?: Provider;
};

type SignUpOptions = {
  email: string;
  password: string;
};
