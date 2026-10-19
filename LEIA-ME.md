# Made in Guetto — site + chatbot híbrido (GitHub Pages)

## Conteúdo
- `index.html` — site da Made in Guetto com o widget do chat inserido.
- `chatbot.js` — interface do chatbot, respostas FAQ locais e conexão opcional com a IA.
- `og-image.jpg` — imagem de compartilhamento.
- `favicon-180.png` — ícone da marca.
- `chatbot-worker/index.js` — backend seguro Cloudflare Worker que chama a OpenAI sem expor a chave no navegador.
- `chatbot-worker/wrangler.toml` — configuração do Worker.

## 1. Publicar o site no GitHub Pages
1. Extraia o ZIP.
2. No repositório `GabrielAraujo/made-in-guetto`, envie os arquivos da raiz do ZIP (`index.html`, `chatbot.js`, `og-image.jpg`, `favicon-180.png`, `LEIA-ME.md`) para a raiz do repositório. A pasta `chatbot-worker` pode também ser mantida no repositório como referência do backend.
3. Faça commit das alterações.
4. Em **Settings → Pages**, use **Deploy from a branch**, branch `main`, pasta `/(root)`.
5. O site ficará em `https://gabrielaraujo.github.io/made-in-guetto/` após a publicação.

O chat terá as respostas de FAQ mesmo sem IA. Para perguntas que exigem informação não confirmada, ele oferece o WhatsApp.

## 2. Ativar IA segura com Cloudflare Workers
A hospedagem GitHub Pages é estática e não deve guardar a chave da OpenAI. O backend em `chatbot-worker/` mantém a chave do lado do servidor.

### Pelo painel Cloudflare (sem instalar ferramentas)
1. Crie/entre em uma conta em https://dash.cloudflare.com/.
2. Abra **Workers & Pages → Create → Worker** e crie um Worker chamado `made-in-guetto-chatbot`.
3. Abra **Edit code** e substitua o código inicial pelo conteúdo de `chatbot-worker/index.js`. Salve e faça deploy.
4. Nas configurações do Worker, adicione a variável normal `ALLOWED_ORIGIN` com valor `https://gabrielaraujo.github.io`.
5. Adicione um secret chamado `OPENAI_API_KEY` com sua chave de API da OpenAI. Não coloque a chave em `index.html`, `chatbot.js`, `wrangler.toml` nem no GitHub.
6. (Opcional) Adicione a variável `OPENAI_MODEL` com um modelo disponível na sua conta. O padrão do código é `gpt-6-astra`; se sua conta não tiver acesso a esse modelo, escolha um modelo habilitado para seu projeto.
7. Copie a URL pública do Worker, por exemplo `https://made-in-guetto-chatbot.SEU-SUBDOMINIO.workers.dev`.
8. Edite `chatbot.js` e substitua `const API_URL = '';` por `const API_URL = 'https://SUA-URL.workers.dev';` acrescentando `/` e `api/chat` ao final, por exemplo `https://made-in-guetto-chatbot.SEU-SUBDOMINIO.workers.dev/api/chat`.
9. Envie o `chatbot.js` atualizado ao GitHub e faça commit. Aguarde o Pages publicar a alteração.

### Usando Wrangler (opcional)
Com Node.js instalado:
```bash
cd chatbot-worker
npm install -g wrangler
wrangler login
wrangler secret put OPENAI_API_KEY
wrangler deploy
```
Confirme que `ALLOWED_ORIGIN` no `wrangler.toml` corresponde exatamente a `https://gabrielaraujo.github.io`. Depois copie a URL gerada e atualize `API_URL` em `chatbot.js`.

## Perguntas frequentes contempladas no chatbot
- O que é a Made in Guetto?
- Quais peças estão disponíveis?
- O que significa modelagem oversized?
- As estampas são na frente e nas costas?
- Quais cores estão disponíveis?
- Como consultar tamanho e medidas?
- Qual é o preço e há promoções?
- Como consultar frete, prazo e entrega?
- Quais formas de pagamento são aceitas?
- Como fazer um pedido?
- Vocês fazem personalização ou encomendas?
- Como acompanhar meu pedido?
- Como cuidar e lavar a camiseta?
- Como funcionam trocas, devoluções e defeitos?
- Vocês vendem no atacado ou fazem parcerias?
- Existe loja física ou retirada?
- Quais são as redes sociais oficiais?
- Como falar com uma pessoa da equipe?

As perguntas sobre informações comerciais não confirmadas são respondidas com encaminhamento ao WhatsApp, sem inventar preço, estoque, prazo, formas de pagamento ou políticas.

## 3. O que o bot sabe e o que não deve inventar
- Confirmado: marca Made in Guetto, foco em streetwear oversized/estampas e WhatsApp `+55 11 95333-6229`.
- Ainda não confirmado no site: preços, estoque, tabela de medidas, frete/prazo, formas de pagamento e regras de troca/devolução. O bot deve encaminhar essas dúvidas à equipe em vez de inventar respostas.
- Não há integração com pedidos, pagamentos ou estoque. O bot não consegue consultar esses sistemas.

## 4. Testes antes de divulgar
- Abra o site no celular e no computador; teste abrir/fechar o chat e os botões de perguntas rápidas.
- Sem `API_URL`, teste uma pergunta frequente e outra não reconhecida: FAQ responde localmente e perguntas específicas mostram a opção de WhatsApp.
- Após ativar o Worker, teste uma pergunta geral e uma pergunta sobre preço. O bot deve encaminhar preços não confirmados à equipe.
- Confira no painel da OpenAI os limites e o uso da API. O uso da API pode gerar cobrança independente da assinatura ChatGPT.

## Segurança
- A chave é guardada como secret no Worker e nunca deve ser colocada no navegador ou commitada no GitHub.
- O Worker valida a origem, limita tamanho de mensagem e histórico, usa `store: false` e não oferece acesso a sistemas de pedido.
- Antes de anunciar publicamente, configure limites de uso/orçamento no provedor e monitore abuso. A verificação de origem CORS ajuda a restringir navegadores, mas não substitui rate limiting robusto contra chamadas automatizadas.
