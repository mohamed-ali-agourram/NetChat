import { GoAlertFill } from "react-icons/go"
import clsx from "clsx"

interface Props{
    type: string
    isLoading?: boolean
    hideModal: ()=>void
    action: ()=>void
}

const DeleteModal = ({isLoading, hideModal, action, type}: Props) => {
    return (
        <div className="flex bg-main-bg p-5 sm:p-[1.5vh] sm:gap-1">
            <GoAlertFill className="text-red-600 text-[35px] sm:text-[30px] w-[10%]" />
            <div className="text-start w-[90%] flex flex-col sm:gap-1">
                <h1 className="font-bold text-[20px] sm:text-[17px]">Delete {type}</h1>
                <p className="sm:text-[14px]">Are you sure you want to delete this {type}? This action cannot be undone.</p>
                <div className="self-end flex gap-2">
                    <button
                        className={clsx(`
                                p-2
                                sm:p-1
                                rounded
                                transition-all delay-75
                                `,
                            isLoading && "bg-loading"
                        )}
                        onClick={hideModal}>
                        Cancel
                    </button>
                    <button
                        className={clsx(`
                                p-2
                                sm:p-1
                                rounded
                                transition-all delay-75
                                `,
                            isLoading ? "bg-loading" : "bg-red-600"
                        )}
                        onClick={action}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteModal