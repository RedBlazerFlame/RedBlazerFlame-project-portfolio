export function redirect(url, target) {
    let virtualAnchor = document.createElement("a");
    virtualAnchor.href = url;
    virtualAnchor.target = target;
    virtualAnchor.click();
}
