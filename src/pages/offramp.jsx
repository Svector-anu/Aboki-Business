import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";
import DashboardLayout from "../components/DashboardLayout";
import LoadingScreen from "../components/LoadingScreen";
import OfframpPage from "../components/OfframpPage";

export default function Offramp() {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/signin");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <>
                <Head>
                    <title>Offramp - Aboki</title>
                    <meta name="description" content="Convert crypto to Nigerian Naira - Aboki" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <LoadingScreen message="Loading offramp" />
            </>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <>
            <Head>
                <title>Offramp - Aboki</title>
                <meta name="description" content="Convert crypto to Nigerian Naira - Aboki" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <DashboardLayout>
                <OfframpPage />
            </DashboardLayout>
        </>
    );
}