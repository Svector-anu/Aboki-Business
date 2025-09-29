import { AdminResetPasswordForm } from "../../../components/auth";
import Head from "next/head";

export default function AdminResetPasswordPage() {
   return (
      <>
         <Head>
            <title>Reset Admin Password - ABOKI Admin</title>
            <meta name="description" content="Reset your ABOKI admin account password" />
            <meta name="robots" content="noindex, nofollow" />
            <meta
               name="viewport"
               content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <AdminResetPasswordForm />
      </>
   );
}