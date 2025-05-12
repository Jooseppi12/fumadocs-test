"use client";

import { useEffect } from "react";

export function CopyCodeComponent({id} : Props) {
    useEffect(() => {
        if(typeof window === 'undefined') { }
        const parent = document.getElementById(id);
        const copyButtons = parent?.getElementsByClassName("copy");
        if (copyButtons === undefined) {}        
        else {
            for (let i = 0; i < copyButtons.length; i++) {
                const el = copyButtons[i];
                el.addEventListener("click", function () {
                  const code = el.getAttribute("data-code") ?? "";
                  navigator.clipboard.writeText(code);
                  el.classList.add('copied');
                  setTimeout(() => el.classList.remove('copied'), 2000)
                });
            }
        }
    })
    return (null);
}

interface Props {
    id: string
}