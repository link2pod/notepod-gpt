import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Link href={"./editor"}><p>Editor</p></Link>
      <Link href={"./login"}><p>Authenticate</p></Link>
    </>
  )
}
