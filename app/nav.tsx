import Link from "next/link";

export default function (){
    return (<div className="grid grid-flow-col fixed top-0 w-full justify-evenly">
        <Link href={"/editor"}><div>Editor</div></Link> 
        <Link href={"/auth"}><div>Authentication</div></Link> 
    </div>)
}
