"use client";

import { ReactNode, useEffect } from "react";
import { ConvexReactClient, useMutation } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function SyncUser() {
  const { isSignedIn, isLoaded } = useAuth();
  const storeUser = useMutation(api.users.storeUser);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      storeUser().catch(console.error);
    }
  }, [isLoaded, isSignedIn, storeUser]);

  return null;
}

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <SyncUser />
      {children}
    </ConvexProviderWithClerk>
  );
}
