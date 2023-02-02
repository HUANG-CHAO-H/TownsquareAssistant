import {useEffect, useRef} from "react";
import {adapterState} from "../adapter";

/**
 * 将聊天文本数据append到一个div中去（需要不受react监控）
 */
export function useChatContent() {
    const divRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const observer = (value: string) => {
            const div = divRef.current;
            if (!div) return;
            const container: HTMLDivElement = div.firstChild as HTMLDivElement;
            const oldLength = container.childNodes.length;
            container.innerHTML = '';
            if (!value) return;
            console.info(value);
            const pArray: HTMLParagraphElement[] = []
            for (const str of value.split('\n')) {
                const p = document.createElement('p');
                p.innerText = str;
                pArray.push(p);
            }
            container.append(...pArray);
            if (oldLength !== container.childNodes.length) {   // 滚动轴修正
                div.scrollTop = div.scrollHeight;
            }
        }
        let interval: NodeJS.Timer | undefined = setInterval(() => {
            if (!divRef.current) return;
            observer(adapterState.data.chatContent);
            if (interval !== undefined) clearInterval(interval);
            interval = undefined;
        }, 100);
        adapterState.observe('chatContent', observer)
        return () => {
            adapterState.unObserve('chatContent', observer);
            if (interval !== undefined) clearInterval(interval);
            interval = undefined;
        }
    }, []);
    return divRef;
}
