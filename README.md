# Documentação do Desafio

## Dia 1 - Implementando o Editor & Autosave
- Dei uma estudada antes de fazer qualquer implementação, procurei entender como funcionava o Editor da TipTap e quando finalmente consegui entender criei 2 componentes.
    - ToolBar para as ferramentas do Editor Rich Text
    - TipTap para implementar o editor de textos e o autosave

- Fiz o autosave utilizando o próprio LocalStorage, uma maneira fácil e rápida de implementação e de edição
- Criei a função de submit que zera os valores, assim não permitindo o LocalStorage sobrecarregar o espaço

## Dia 2 - Implementando as últimas opções
- Passei o dia inteiro trabalhando no desafio, consegui concluir agora 18:27
- Passei a maior parte do tempo planejando como eu faria uma UX simples e que seja fácil do usuário trabalhar sem abrir diversas abas no navegador
- Após isso, comecei a usar os componentes prontos do ShadcnUI para que seria uma mão na roda para implementar as últimas opções que faltava
- Utilizei o React Query que me ajudou muito a fazer o que eu estava querendo, que era renderizar os componentes assim que fossem criados
- Utilizei da ContextAPI para que eu pudesse fazer um sistema de edição fácil e uma comununicação mais assertiva entre meus componentes
- Adicionei a opção de adicionar imagens e links no Rich Text

## Como rodar a aplicação
1. Clone o repositório
2. Rode o comando `npm install` para instalar as dependências
3. Copie o arquivo `.env.example` para `.env` e preencha com as informações do seu ambiente
4. Rode o comando `docker-compose up -d` para subir o banco de dados em um container
5. Rode o comando `npx prisma migrate dev` para executar as migrations do banco de dados
6. Rode o comando `npm run dev` para executar a aplicação