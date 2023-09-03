'use client';
import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { LuPanelLeftClose } from 'react-icons/lu'

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  children: React.ReactNode;
  isCloseButton?: boolean
}

const PopUpModal: React.FC<ModalProps> = ({ isOpen, onClose, children, isCloseButton }) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="
              fixed 
              inset-0 
              bg-[#000000e7] 
              transition-opacity
            "
          />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div
            className="
              flex 
              min-h-full 
              items-center 
              justify-center 
              p-4 
              text-center 
              sm:p-0
            "
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className="
                  relative 
                  transform 
                  overflow-hidden 
                  rounded-lg 
                  bg-[black]
                  shadow-xl 
                  transition-all
                  w-fit
                  sm:w-[95%]
                "
              >
                <div
                  className="
                    absolute 
                    right-0 
                    top-0 
                    hidden 
                    pr-4 
                    pt-4 
                    sm:block
                    z-10
                  "
                >
                  {
                    isCloseButton
                      ? <button
                        type="button"
                        className="
                        rounded-md 
                        text-gray-400 
                      "
                        onClick={onClose}
                      >
                        <span className="sr-only">Close</span>
                        <LuPanelLeftClose className="h-6 w-6" aria-hidden="true" />
                      </button>
                      : null
                  }

                </div>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default PopUpModal;
