const base = 'http://localhost:9001'
export function fetchContext() {
    return fetch(`${base}/vamei/context.json`)
        .then(res => res.json())
}
export function fetchArticle(path) {
    return fetch(`${base}${path}`)
        .then(res => res.json())
}