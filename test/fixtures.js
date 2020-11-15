export function template (html = '', type) {
    const template = document.createElement('template')
    template.innerHTML = html

    if (type) template.setAttribute('type', type)

    return template
}