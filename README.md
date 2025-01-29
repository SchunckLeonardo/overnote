# Documentação do Desafio

## Dia 1 - Implementando o Editor & Autosave
- Dei uma estudada antes de fazer qualquer implementação, procurei entender como funcionava o Editor da TipTap e quando finalmente consegui entender criei 2 componentes.
    - ToolBar para as ferramentas do Editor Rich Text
    - TipTap para implementar o editor de textos e o autosave

- Fiz o autosave utilizando o próprio LocalStorage, uma maneira fácil e rápida de implementação e de edição
- Criei a função de submit que zera os valores, assim não permitindo o LocalStorage sobrecarregar o espaço
