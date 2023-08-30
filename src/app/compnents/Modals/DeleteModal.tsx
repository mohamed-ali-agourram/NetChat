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
        <div className="flex bg-main-bg p-5">
            <GoAlertFill className="text-red-600 text-[35px] w-[10%]" />
            <div className="text-start w-[90%] flex flex-col">
                <h1 className="font-bold text-[20px]">Delete {type}</h1>
                <p>Are you sure you want to delete this {type}? This action cannot be undone.</p>
                <div className="self-end flex gap-2">
                    <button
                        className={clsx(`
                                p-2
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