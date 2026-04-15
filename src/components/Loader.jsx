import { Loader2 } from "lucide-react"

export const ButtonLoader = ({text='Submitting...'}) => {
    return (
        <div className="flex justify-center items-center text-black-500">
            <Loader2 className="animate-spin mr-2" /> {text}
        </div>
    )
}

export const Loader = ({text='Loading...'}) => {
    return (
        <div className="flex justify-center items-center py-20 text-blue-500">
            <Loader2 className="animate-spin mr-2" /> {text}
        </div>
    )
}
