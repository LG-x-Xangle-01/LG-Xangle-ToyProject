import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import FileUpload from "@/components/FileUpload";
import Login from "@/components/Login";

export default function Home() {
  return (
    <>
      <Head>
        <title>LG Xangle Project</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Login />
        <FileUpload />
      </main>
    </>
  )
}
