import { ResetPasswordForm } from "../../components/auth";
import Head from "next/head";

export default function ResetPasswordPage() {
   return (
      <>
         <Head>
            <title>Reset Password - Aboki</title>
            <meta name="description" content="Reset your Aboki account password" />
            <meta
               name="viewport"
               content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <ResetPasswordForm />
      </>
   );
}