Minuta de Definição de Requisitos | MVP v1: Calculador de Corridas
Data: 27 de Setembro de 2025
Participantes: Analista de Requisitos (Gemini), Thiago Stella Pontes (Stakeholder/Desenvolvedor)

1. Problema Central Identificado
O processo atual para cotação de valor de corridas é manual, baseado em consultas ao Google Maps e cálculos feitos na hora. Isso gera atrito, lentidão e uma imagem pouco profissional durante a prospecção de novos clientes (comerciantes), impactando negativamente a agilidade e a confiança no momento da venda.

2. Objetivo Estratégico do MVP
Desenvolver uma ferramenta de vendas pública e instantânea que permita a qualquer visitante do site calcular o valor de uma corrida de forma precisa e transparente. O objetivo é remover a fricção do processo de prospecção, passando uma imagem de profissionalismo e eficiência para potenciais clientes.

3. User Story Aprovada
"Como um Visitante do site (seja o dono da empresa demonstrando ou o próprio comerciante), eu quero inserir endereços de partida e destino para calcular o valor de uma corrida instantaneamente, para que eu possa ter uma estimativa de custo clara, rápida e transparente."

4. Critérios de Aceite (Definition of "Done")
Para que a funcionalidade seja considerada completa e "pronta", os seguintes critérios devem ser atendidos:

Cálculo Visível: O sistema deve permitir a inserção de um endereço de partida e um de destino e, ao acionar um botão, exibir o valor final da corrida de forma clara para o usuário.

Regra de Negócio Aplicada: O cálculo do valor deve ser baseado na distância em KM (obtida via API), multiplicada por R$ 3,00. A distância em KM deve ser arredondada matematicamente (casas decimais >= 0.5 arredondam para cima, < 0.5 arredondam para baixo) antes da multiplicação.

Formato de Exibição: O valor final deve ser exibido em formato de moeda brasileira (ex: "Valor da Corrida: R$ 27,00").

Tratamento de Erros: O sistema deve apresentar uma mensagem de erro amigável e clara caso um dos endereços seja inválido ou uma rota não possa ser traçada entre os pontos.

Experiência do Usuário (Autocomplete): O sistema deve sugerir endereços completos e válidos (autocomplete) enquanto o usuário digita nos campos, a fim de minimizar erros de digitação e agilizar o preenchimento.

5. Escopo Futuro (Itens em Backlog para v2 e além)
As seguintes funcionalidades foram discutidas и intencionalmente adiadas para garantir a agilidade na entrega do MVP. Elas compõem o backlog para futuras versões do produto:

Área de login para comerciantes cadastrados.

Integração com métodos de pagamento para solicitação da corrida.

Disparo de notificações de novos pedidos (via e-mail ou WhatsApp) para o administrador.

Sistema de cadastro, gestão e atribuição de motoboys (potencialmente em um PWA - Progressive Web App).

____________________________________________________________________________________________________



Minuta de Requisitos | Sprint de Migração de Contas AWS
Data: 08 de Outubro de 2025
Participantes: Analista de Requisitos (Gemini), Thiago Stella Pontes (Arquiteto de Nuvem/Desenvolvedor)

1. Problema Central Identificado
A infraestrutura do MVP v1.0 foi implantada na conta AWS pessoal do desenvolvedor. Com a profissionalização do projeto, tornou-se imperativo separar os recursos da empresa dos recursos pessoais para garantir governança, segurança, gestão de custos e uma postura profissional adequada para o negócio.

2. Objetivo Estratégico da Sprint
Migrar 100% da infraestrutura serverless da conta pessoal para a nova conta corporativa ("okmotoboysexpress"). O processo deve ser executado de forma segura e automatizada, estabelecendo as melhores práticas de Infraestrutura como Código (IaC) para o futuro do projeto.

3. Escopo da Migração
A migração contempla a replicação exata dos seguintes recursos na nova conta:

Amazon API Gateway (API REST e seus endpoints).

AWS Lambda (A função com a lógica de negócio).

Amazon Location Service (Recursos de Place Index e Route Calculator).

AWS IAM (Roles e Policies de permissão).

4. Critérios de Aceite (Definition of "Done")
Para que a migração seja considerada completa e "pronta", os seguintes critérios devem ser atendidos:

Infraestrutura como Código: A arquitetura deve ser totalmente descrita em um arquivo template.yaml usando AWS SAM. O arquivo deve ser commitado no repositório do projeto.

Implantação Automatizada: A criação da infraestrutura na nova conta deve ser executada via linha de comando (sam deploy), sem criação manual de recursos no console.

Paridade Funcional: A nova infraestrutura deve replicar com 100% de fidelidade o comportamento da original, validado por testes ponta-a-ponta a partir do frontend.

Segurança: A implantação na nova conta deve ser feita por um usuário IAM dedicado, não utilizando o usuário root.

Transição (Cutover): O frontend deve ser atualizado com a nova URL da API gerada na conta "okmotoboysexpress" e permanecer totalmente funcional.

Descomissionamento: Os recursos da conta pessoal original devem ser desativados e deletados após a validação completa da nova infraestrutura.

5. Backlog de Tarefas da Sprint
As seguintes tarefas foram definidas para garantir a execução bem-sucedida da sprint:

Codificar os recursos (Lambda, API Gateway, IAM) no arquivo template.yaml.

Preparar o pacote da aplicação com o comando sam build.

Configurar o acesso programático (usuário IAM) na nova conta AWS.

Executar o sam deploy para implantar a infraestrutura na nova conta.

Validar os recursos criados no console da AWS.

Atualizar o endpoint da API na aplicação frontend e executar testes.

Deletar os recursos da conta AWS original.

_____________________________________________



Minuta de Definição de Requisitos | v1.1: Refinamento e Foco em Contratos
Data: 13 de Outubro de 2025
Participantes: Analista de Requisitos (Gemini), Thiago Stella Pontes (Stakeholder/Desenvolvedor)

1. Problema Central Identificado
O MVP v1.0 está funcional, mas o feedback do uso inicial revelou oportunidades de melhoria na experiência do usuário e no alinhamento com a identidade visual da empresa. Adicionalmente, o site atual não possui uma área clara e um chamado à ação (call-to-action) específico para atrair clientes de maior valor: os comerciantes interessados em contratos de longo prazo.

2. Objetivo Estratégico da Sprint
Refinar a interface do site e da calculadora para fortalecer a marca e melhorar a usabilidade. Introduzir uma nova seção de conteúdo e um ponto de conversão dedicado para a prospecção ativa de clientes de contrato, além de implementar uma melhoria chave de usabilidade na calculadora (busca por CEP).

3. User Stories Aprovadas
"Como um Visitante, eu quero navegar em um site com um visual mais profissional e textos mais claros, para que a minha percepção de confiança na empresa aumente."

"Como um Dono de Comércio, eu quero entender facilmente como funciona o serviço de contrato e ter um botão direto para iniciar a conversa, para que eu possa agilizar a parceria com a OK Express."

"Como um Usuário da Calculadora, eu quero preencher meu CEP e ter o endereço preenchido automaticamente, para que o processo de cotação seja ainda mais rápido e preciso."

4. Critérios de Aceite (Definition of "Done")
Para que a versão 1.1 seja considerada completa e "pronta", os seguintes critérios devem ser atendidos:

Ajustes na Página Principal (index.html):

Identidade Visual: O plano de fundo (background) do site deve ser substituído pela imagem timbrada oficial da OK Express.

Texto do Botão Principal: O texto do botão no topo do site deve ser alterado de "Peça agora" para "Faça já sua consulta".

Texto do Botão de Ação: O texto do botão de chamada para a calculadora na seção "hero" deve ser alterado de "calcular frete" para "Calcule seu frete".

Destino do Botão Principal: O botão "Faça já sua consulta" (antigo "Peça agora") deve agora redirecionar o usuário para a página calculadora.html.

Responsividade do Menu: O CSS do menu de navegação deve ser adaptado para garantir uma exibição correta e elegante em telas de desktop.

Expansão da Seção 'Sobre' (index.html):

Conteúdo Adicional sobre Contratos: A seção about será expandida. Além do texto original (que será mantido), um novo conteúdo explicando como funciona o modelo de contrato para comerciantes deve ser adicionado.

Ponto de Conversão (Contratos): Ao final do novo texto sobre contratos, um novo botão de WhatsApp deve ser inserido. Este botão deve direcionar o usuário para uma conversa com a mensagem pré-definida: "Gostaria de falar a respeito de contrato".

Ajustes na Página da Calculadora (calculadora.html):

Layout dos Resultados: A exibição dos resultados de "Valor" e "Distância" deve ser movida para a mesma div dos campos de endereço. A fonte dos resultados deve ser padronizada para não ter um destaque excessivo em relação aos outros elementos.

Área de Marketing: A área anteriormente ocupada pelo mapa deve ser utilizada para exibir uma propaganda ou material de marketing da própria OK Express.

Nova Funcionalidade (Busca por CEP):

Implementação da Busca: Um novo campo para "CEP" deve ser adicionado aos formulários de origem e destino.

Preenchimento Automático: Ao digitar um CEP válido e sair do campo (evento "blur"), o sistema deve fazer uma consulta a uma API externa (ex: ViaCEP) e preencher automaticamente os campos de Endereço, Bairro e Cidade correspondentes.

5. Escopo Futuro (Itens em Backlog para v2.0)
As seguintes funcionalidades de maior escopo permanecem no backlog para a próxima grande versão do produto:

Área de login para comerciantes cadastrados.

Integração com métodos de pagamento para solicitação da corrida.

Disparo de notificações de novos pedidos (via e-mail ou WhatsApp) para o administrador.

Sistema de cadastro, gestão e atribuição de motoboys (potencialmente em um PWA - Progressive Web App).

_____________________________________________________________________________________________________
