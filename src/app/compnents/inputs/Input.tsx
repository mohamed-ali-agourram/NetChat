import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { IconType } from "react-icons";
import {
  FieldValues,
  UseFormRegister
} from "react-hook-form";
import "./styles.css";

interface InputProps {
  type: string
  label: string
  id: string
  icon: IconType
  disabled: boolean
  onclick?: () => void
  register: UseFormRegister<FieldValues>
  state: boolean
  setState: Dispatch<SetStateAction<boolean>>

}

const Input: React.FC<InputProps> = ({
  type,
  label,
  id,
  icon: Icon,
  onclick,
  register,
  disabled,
  state,
  setState
}) => {
  const handleStyle = () => {
    setState(false)
  }

  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => {
    setIsFocused(true);
    setState(false)
  };
  const handleBlur = () => {
    setIsFocused(false);
    setState(false)
  };

  return (
    <div
      onClick={handleStyle}
      className={`
        flex border bg-gray-600 p-3 sm:p-2 rounded from-group items-center justify-between
        ${state ? "border border-red-500" : null}
        ${isFocused ? "!border-blue-400" : ""}
      `}>
      <div className="flex flex-col">
        <label className="sm:!text-[12px]" htmlFor={id}>{label}</label>
        <input
          required
          {...register(id, { required: true })}
          type={type}
          name={id}
          id={id}
          placeholder={label}
          disabled={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="sm:text-[15px]"
        />
      </div>
      <Icon className={onclick && "cursor-pointer"} style={{ fontSize: "23px" }} onClick={onclick ? onclick : undefined} />
    </div>
  );
};

export default Input;
