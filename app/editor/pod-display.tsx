
export default function ({id, selected, pod}: {id: Number, selected: Boolean, pod: string}){
    return (<div
        className={` ${selected && "border-2"}`}
    >
        <h2>Pod #{id.toString()}</h2> <br /> {pod}
    </div>)
}
