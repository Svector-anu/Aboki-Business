import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";
import DashboardLayout from "../components/DashboardLayout";
import OnrampPage from "../components/OnrampPage";

export default function Onramp() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Onramp - Aboki</title>
      </Head>
      <DashboardLayout>
        <OnrampPage />
      </DashboardLayout>
    </>
  );
}