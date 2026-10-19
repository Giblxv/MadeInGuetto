/* Made in Guetto — chat híbrido FAQ + IA.
   Para ativar a IA, substitua API_URL pela URL pública do Worker (ex.: https://mig-chatbot.seu-subdominio.workers.dev/api/chat).
   Não coloque a chave da OpenAI neste arquivo. */
(() => {
  'use strict';
  const API_URL = '';
  const WA_NUMBER = '5511953336229';
  const $ = (s, root=document) => root.querySelector(s);
  const root = $('#mig-chat');
  if (!root) return;

  const normalize = s => (s || '').toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const waLink = (text='Olá! Vim pelo site da Made in Guetto e preciso de ajuda.') => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  const faq = [
    { keys: ['o que e made in guetto','sobre a marca','quem e a made','identidade da marca','qual e a proposta'], answer: 'A Made in Guetto tem uma pegada streetwear urbana, com camisetas oversized e estampas de impacto. 🖤🔥' },
    { keys: ['pecas disponiveis','quais pecas','ver as pecas','catalogo','camisetas disponiveis','produtos','tem camiseta','quais produtos'], answer: 'A vibe da marca é streetwear oversized e estampas marcantes. Pra ver os modelos disponíveis agora e confirmar o estoque, chama a gente no WhatsApp. 😎', link: true },
    { keys: ['o que e oversized','significa oversized','modelagem oversized','como e o caimento','caimento da camiseta'], answer: 'Oversized é aquela modelagem mais ampla, com visual soltinho e urbano. Mas pra acertar no caimento e no tamanho da peça específica, chama a gente no WhatsApp. 👕' },
    { keys: ['frente e costas','estampa nas costas','estampa na frente','como e a estampa','detalhes da estampa'], answer: 'O site apresenta a proposta de estampas marcantes, com artes na frente e nas costas. A arte pode variar por modelo, então chama a gente pra conferir a peça que você curtiu. 🎨', link: true },
    { keys: ['cor da camiseta','cores disponiveis','tem preta','tem branca','camiseta preta','camiseta branca'], answer: 'O site mostra prévias em preto e branco, mas isso não confirma o estoque disponível. Chama a equipe no WhatsApp pra ver as cores e os modelos que estão disponíveis hoje. 🖤🤍', link: true },
    { keys: ['tamanho','medida','tabela de medidas','caimento','qual tamanho'], answer: 'Ninguém merece errar no tamanho 😅 A tabela de medidas ainda não foi confirmada no site. Chama a gente no WhatsApp que te orientamos antes de fechar.' , link: true },
    { keys: ['preco','quanto custa','valor','valores','tem promocao','desconto'], answer: 'Pra não te passar preço errado, preciso confirmar a peça e o valor atualizado com a equipe. Chama a gente no WhatsApp e manda qual modelo você curtiu. 💸', link: true },
    { keys: ['frete','entrega','prazo de entrega','envio','cep','chega quando'], answer: 'O prazo e o frete dependem do pedido e do endereço. Manda seu CEP e a peça que você quer no WhatsApp pra equipe confirmar certinho. 📦', link: true },
    { keys: ['pagamento','pix','cartao','parcelamento','boleto','formas de pagar'], answer: 'As formas de pagamento ainda não estão confirmadas aqui no site. Chama a equipe no WhatsApp antes de finalizar que te passamos as opções disponíveis.', link: true },
    { keys: ['como comprar','fazer pedido','comprar uma','quero comprar','como faco pedido','finalizar compra'], answer: 'Bora escolher sua peça! 😎 Chama a equipe no WhatsApp, fala qual modelo você curtiu e a gente te orienta sobre disponibilidade, preço e como pedir.', link: true },
    { keys: ['personalizar','personalizada','posso mandar minha arte','estampa personalizada','faz sob encomenda','encomenda'], answer: 'Sobre personalização e pedidos sob encomenda, preciso confirmar as opções disponíveis com a equipe. Manda sua ideia no WhatsApp que a gente te orienta. 🎨', link: true },
    { keys: ['acompanhar pedido','rastreio','rastreamento','onde esta meu pedido','status do pedido'], answer: 'Eu não tenho acesso ao sistema de pedidos ou rastreamento por aqui. Chama a equipe no WhatsApp e, se já comprou, envie o número do pedido para te ajudarem. 📦', link: true },
    { keys: ['lavar','lavagem','como cuidar','conservar a estampa','pode passar ferro'], answer: 'As instruções específicas de lavagem e cuidado ainda não estão cadastradas no site. Pra não arriscar sua peça, confirma as recomendações com a equipe no WhatsApp. 🧼', link: true },
    { keys: ['troca','devolucao','devolver','reembolso','produto com defeito'], answer: 'Quero te orientar direitinho, sem inventar regra. As condições de troca e devolução precisam ser confirmadas pela equipe no WhatsApp.', link: true },
    { keys: ['atacado','revenda','comprar em quantidade','pedido grande','parceria'], answer: 'Sobre atacado, revenda ou parcerias, preciso confirmar as condições com a equipe. Chama a gente no WhatsApp e conta um pouco do que você precisa. 🤝', link: true },
    { keys: ['endereco da loja','loja fisica','onde fica','retirar pessoalmente'], answer: 'O endereço e a opção de retirada não estão confirmados no site. Chama a equipe no WhatsApp pra conferir as opções de atendimento e entrega.', link: true },
    { keys: ['instagram','tiktok','redes sociais'], answer: 'As redes sociais oficiais ainda não estão listadas no site. Chama a gente no WhatsApp que a equipe te orienta por lá.', link: true },
    { keys: ['whatsapp','atendente','pessoa','humano','falar com alguem','contato','falar com vendedor'], answer: 'Fechou! Fala direto com a equipe da Made in Guetto por aqui 👇', link: true }
  ];

  root.innerHTML = `
    <button class="mig-chat-launch" type="button" aria-label="Abrir atendimento da Made in Guetto" aria-expanded="false"><span class="mig-chat-dot"></span><span class="mig-chat-launch-label">Fala com a gente</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v12H9l-5 4V4zm4 4h8M8 12h5"/></svg></button>
    <section class="mig-chat-panel" aria-label="Chat da Made in Guetto" aria-hidden="true">
      <header class="mig-chat-head"><div class="mig-chat-avatar">MG</div><div class="mig-chat-headcopy"><strong>Made in Guetto</strong><span><i></i> Atendimento virtual · online</span></div><button type="button" class="mig-chat-close" aria-label="Fechar chat">×</button></header>
      <div class="mig-chat-messages" aria-live="polite" aria-relevant="additions">
        <div class="mig-chat-msg bot">Salve! 👋 Sou o assistente virtual da Made in Guetto. Posso tirar dúvidas rápidas sobre as peças e te conectar com a equipe quando precisar. Qual é a boa?</div>
        <div class="mig-chat-suggestions"><button type="button" data-question="Quais peças estão disponíveis?">Ver peças 👕</button><button type="button" data-question="Como saber meu tamanho?">Tamanhos 📏</button><button type="button" data-question="Qual é o preço da camiseta?">Preços 💸</button><button type="button" data-question="Qual é o prazo de entrega?">Entrega 📦</button></div>
      </div>
      <form class="mig-chat-form"><label class="mig-chat-sr" for="mig-chat-input">Escreva sua pergunta</label><input id="mig-chat-input" maxlength="700" autocomplete="off" placeholder="Manda sua dúvida..." required><button type="submit" aria-label="Enviar mensagem"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 21 3l-5.5 18-3.2-7.3L3 11.5zm9.3 2.2L21 3"/></svg></button></form>
      <div class="mig-chat-foot">Atendimento virtual · <a href="${waLink()}" target="_blank" rel="noopener">Falar no WhatsApp</a></div>
    </section>`;

  const style = document.createElement('style');
  style.textContent = `
  .mig-chat-launch{position:fixed;right:20px;bottom:92px;z-index:9998;display:flex;align-items:center;gap:10px;border:2px solid #f4f1ea;border-radius:999px;background:#e11d2e;color:#fff;padding:12px 16px;box-shadow:4px 4px 0 #f4f1ea;font:800 14px/1.1 system-ui,sans-serif;cursor:pointer;transition:transform .18s}
  .mig-chat-launch:hover{transform:translateY(-2px)}.mig-chat-launch svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.mig-chat-dot{width:8px;height:8px;background:#8effa5;border-radius:50%;box-shadow:0 0 0 3px #ffffff25}
  .mig-chat-panel{position:fixed;right:20px;bottom:158px;z-index:9999;width:min(370px,calc(100vw - 28px));height:min(540px,calc(100dvh - 190px));min-height:360px;display:none;flex-direction:column;overflow:hidden;background:#111;color:#f4f1ea;border:1px solid #4a4a4a;border-radius:18px;box-shadow:0 18px 60px #0009;font-family:system-ui,-apple-system,sans-serif}
  .mig-chat-panel.open{display:flex}.mig-chat-head{display:flex;align-items:center;gap:11px;padding:14px;background:#1b1b1b;border-bottom:1px solid #373737}.mig-chat-avatar{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:#e11d2e;color:white;font-size:13px;font-weight:900;border:2px solid #f4f1ea}.mig-chat-headcopy{display:flex;flex:1;flex-direction:column;gap:3px}.mig-chat-headcopy strong{font-size:14px}.mig-chat-headcopy span{font-size:11px;color:#b9b4ac}.mig-chat-headcopy i{display:inline-block;width:6px;height:6px;background:#72e89a;border-radius:50%;margin-right:4px}.mig-chat-close{border:0;background:transparent;color:#f4f1ea;font-size:28px;line-height:1;cursor:pointer;padding:0 4px}
  .mig-chat-messages{flex:1;overflow:auto;padding:15px 12px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth}.mig-chat-msg{max-width:90%;padding:11px 12px;border-radius:13px;font-size:13px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.mig-chat-msg.bot{align-self:flex-start;background:#262626;border:1px solid #3b3b3b}.mig-chat-msg.user{align-self:flex-end;background:#e11d2e;color:white;border-bottom-right-radius:4px}.mig-chat-msg a{color:#ff7c86;font-weight:800}.mig-chat-suggestions{display:flex;gap:6px;flex-wrap:wrap}.mig-chat-suggestions button{background:#171717;color:#f4f1ea;border:1px solid #555;border-radius:999px;padding:8px 10px;font-size:11px;cursor:pointer}.mig-chat-form{display:flex;gap:8px;padding:10px;border-top:1px solid #383838;background:#171717}.mig-chat-form input{min-width:0;flex:1;background:#0d0d0d;color:#fff;border:1px solid #484848;border-radius:12px;padding:12px;font-size:13px;outline-offset:2px}.mig-chat-form button{width:44px;flex:0 0 44px;border:0;border-radius:12px;background:#e11d2e;color:white;display:grid;place-items:center;cursor:pointer}.mig-chat-form svg{width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.mig-chat-foot{text-align:center;padding:8px;background:#111;color:#9e9a93;font-size:10px}.mig-chat-foot a{color:#ff5967;font-weight:800;text-decoration:underline}.mig-chat-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.mig-chat-typing{color:#b9b4ac;font-size:12px;padding:5px 10px}.mig-chat-link{display:inline-flex;margin-top:8px;padding:8px 10px;border-radius:8px;background:#e11d2e;color:#fff!important;text-decoration:none!important;font-weight:800}
  @media(max-width:480px){.mig-chat-launch{right:14px;bottom:88px;padding:11px 13px}.mig-chat-panel{right:10px;bottom:148px;width:calc(100vw - 20px);height:min(560px,calc(100dvh - 170px))}.mig-chat-launch-label{font-size:12px}}
  @media(prefers-reduced-motion:reduce){.mig-chat-launch,.mig-chat-messages{transition:none;scroll-behavior:auto}}`;
  document.head.appendChild(style);

  const launch = $('.mig-chat-launch', root), panel = $('.mig-chat-panel', root), close = $('.mig-chat-close', root), messages = $('.mig-chat-messages', root), form = $('.mig-chat-form', root), input = $('#mig-chat-input', root);
  const history = [];
  function openChat(open) { panel.classList.toggle('open', open); panel.setAttribute('aria-hidden', String(!open)); launch.setAttribute('aria-expanded', String(open)); if(open) setTimeout(()=>input.focus(),50); }
  function addMessage(text, who='bot', link=false) { const el=document.createElement('div'); el.className='mig-chat-msg '+who; el.textContent=text; messages.appendChild(el); if(link){const a=document.createElement('a');a.className='mig-chat-link';a.href=waLink('Olá! Vim pelo site da Made in Guetto e queria ajuda com meu atendimento.');a.target='_blank';a.rel='noopener';a.textContent='Chamar no WhatsApp';el.appendChild(document.createElement('br'));el.appendChild(a);} messages.scrollTop=messages.scrollHeight; return el; }
  function localAnswer(text) { const q=normalize(text); for(const item of faq){if(item.keys.some(k=>q.includes(normalize(k)))) return {text:item.answer,link:!!item.link};} return null; }
  async function reply(text) {
    const known=localAnswer(text);
    if(known){addMessage(known.text,'bot',known.link);return;}
    if(!API_URL){addMessage('Essa dúvida é mais específica e meu modo IA ainda precisa ser conectado. Pra não te passar informação errada, chama a equipe no WhatsApp que a gente te ajuda!','bot',true);return;}
    const typing=document.createElement('div');typing.className='mig-chat-typing';typing.textContent='Pensando aqui...';messages.appendChild(typing);messages.scrollTop=messages.scrollHeight;
    try {
      const res=await fetch(API_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:text,history:history.slice(-8)})});
      const data=await res.json(); if(!res.ok) throw new Error(data.error||'Falha no atendimento');
      typing.remove(); const answer=String(data.answer||'Não consegui montar uma resposta agora.');addMessage(answer,'bot',!!data.handoff);history.push({role:'user',content:text},{role:'assistant',content:answer});
    } catch(e) {typing.remove();addMessage('Foi mal, tive um probleminha pra responder agora. Chama a equipe no WhatsApp que a gente não te deixa na mão. 🤝','bot',true);}
  }
  async function send(text){const clean=(text||'').trim();if(!clean)return;addMessage(clean,'user');input.value='';$('.mig-chat-suggestions',messages)?.remove();await reply(clean);}
  launch.addEventListener('click',()=>openChat(!panel.classList.contains('open')));close.addEventListener('click',()=>openChat(false));
  form.addEventListener('submit',e=>{e.preventDefault();send(input.value);});
  root.addEventListener('click',e=>{const b=e.target.closest('[data-question]');if(b)send(b.dataset.question);});
})();
