
export interface TestDropdownElement {
    title: string;
    onClick?: () => void;
    childrenNode?: TestDropdownElement[];
}
// 触发click事件
export function dispatchClickEvent(element: HTMLElement | null): void {
    if (!element) {
        console.error('dispatchClickEvent Error: element 不存在');
        return;
    }
    element.dispatchEvent(new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
    }));
}

// 触发input事件
export function dispatchInputEvent(element: HTMLElement | null) {
    if (!element) {
        console.error('dispatchClickEvent Error: element 不存在');
        return;
    }
    element.dispatchEvent(new InputEvent("input"));
}
