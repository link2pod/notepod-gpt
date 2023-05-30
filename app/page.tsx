import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Link href={"./editor"}><p>Editor</p></Link>
      <Link href={"./auth"}><p>Authenticate</p></Link>
    </>
  )
}
