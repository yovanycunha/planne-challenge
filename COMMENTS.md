# Comentários e reflexões sobre as decisões
## Techs e Libs
Sobre as tecnologias escolhidas para o início do projeto, decidi usar:
- Estilização -> SASS
- Fetch -> Axios
- State Management -> 
- Documentação dos componentes -> Storybook (talvez)

## Features
Live Search aproach
- Criação de um service para os filmes
  - Centralizar todas as chamadas referentes aos filmes
  - Possibilita a expansão para novos cenários em caso de futuras melhorias sem alterar o cenário atual.
- Consumir esse service a partir das alterações no input de busca
  - Utilizar o parâmetro `onChange` do input para a cada letra digitada seja refeita a busca com o novo valor atualizado.


## Componentização
- Encapsulamento do Input em um componente a parte permite o reuso facilitado por todo o projeto em alguma necessidade futura e facilita o entendimento do código a partir da separação do código em partes menores e de fáceis compreensão.