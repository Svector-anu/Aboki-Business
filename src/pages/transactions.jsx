import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";
import DashboardLayout from "../components/DashboardLayout";
import TransactionsPage from "../components/TransactionsPage";

export default function Transactions() {
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
        <title>Transactions - Aboki</title>
      </Head>
      <DashboardLayout>
        <TransactionsPage />
      </DashboardLayout>
    </>
  );
}