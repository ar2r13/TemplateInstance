# TemplateInstance polyfill

[Template Instantiation](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Template-Instantiation.md) polyfill

## Installation

```sh
$ yarn add @custom/template-instance
```

## Usage

_index.html_.

```html
<template id=template>
    Hello, {{ name || 'user' }}
</template>

<script type=module>
    import 'node_modules/@custom/template-instance/dist/'

    const instance = template.createInstance({ name: 'Robins' })
    document.body.append(instance) 

    instance.update({ name: 'Bobins' })
</script>
```

