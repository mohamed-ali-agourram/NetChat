import { MoonLoader } from "react-spinners"

const Spinner = () => {
  return (
    <div className="absolute h-full w-full z-20 flex justify-center items-center bg-[#00000050] left-0 top-0">
        <MoonLoader color="#6767c4"/>
    </div>
  )
}

export default Spinner