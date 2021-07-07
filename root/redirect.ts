// Redirects the user to a different link
export type AnchorTarget = `_${"blank" | "self" | "parent" | "top"}`;

export function redirect(url: string, target: AnchorTarget): void {
    let virtualAnchor: HTMLAnchorElement = document.createElement("a") as HTMLAnchorElement;
    virtualAnchor.href = url;
    virtualAnchor.target = target;
    virtualAnchor.click();
}