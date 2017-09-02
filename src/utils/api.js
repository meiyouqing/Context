const base = ''
export function fetchContext() {
    return fetch(`${base}/vamei/context.json`).then(res => res.json())
}
export function fetchArticle(path) {
    return fetch(`${base}${path}`).then(res => res.json())
}