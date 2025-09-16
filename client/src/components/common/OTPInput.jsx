import { useRef } from "react";

function OTPInput({ length = 4, onChange }) {
    const inputRef = useRef([])

    const handleNumInput = (e, index) => {
        const value = e?.target?.value

        if (!/^[0-9]?$/.test(value)) return;
        inputRef.current[index].value = value

        if (value && index < length - 1) {
            inputRef.current[index + 1].focus()
        }
        concatOTP();
    }

    const handleRemoveInput = (e, index) => {
        if (e?.key === "Backspace") {
            if (inputRef?.current[index]?.value) {
                inputRef.current[index].value = ""
            }
            else if (index > 0) {
                inputRef?.current[index - 1].focus()
            }
        }
        concatOTP()
    }

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("Text").slice(0, length);
        if (!/^[0-9]+$/.test(pasteData)) return;

        pasteData.split("").forEach((char, i) => {
            inputRef.current[i].value = char;
        });

        if (pasteData.length === length) {
            inputRef.current[length - 1].focus();
        } else {
            inputRef.current[pasteData.length]?.focus();
        }

        concatOTP();
    };


    const concatOTP = () => {
        const otp = inputRef?.current?.map((input => input.value)).join("")
        onChange?.(otp)
    }
    return (
        <>
            <div className="w-full flex items-center justify-center gap-2 overflow-hidden mt-4">
                {
                    Array.from({ length }).map((_, index) => (
                        <input
                            key={index}
                            type="number"
                            maxLength={1}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className="!outline-0 !border-0 w-9 h-9 p-3 text-center rounded-lg bg-gray flex items-center justify-center font-semibold text-dark-blue"
                            ref={(el) => inputRef.current[index] = el}
                            onChange={(e) => handleNumInput(e, index)}
                            onKeyDown={(e) => handleRemoveInput(e, index)}
                            onPaste={index === 0 ? handlePaste : undefined}
                        />
                    ))
                }
            </div>
        </>
    )
}

export default OTPInput;