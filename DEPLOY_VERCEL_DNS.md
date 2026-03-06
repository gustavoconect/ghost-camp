# Guia de Deploy Vercel (Ghost Camp) ⛺

Como o domínio *ghostcampsp.com.br* está registrado no **Registro.br** e o DNS está apontado no **Netlify**, o caminho mais fácil para fazer o deploy nesta *Stack (Next.js + Firebase)* é via **Vercel** com apontamento externo.

## Etapa 1: Fazer o Deploy na Vercel

1. Suba este código exato para o **GitHub** da empresa (Crie um repositório privado `ghost-camp`). 
2. Acesse a sua conta da [Vercel](https://vercel.com/) e clique em **Add New Project**.
3. Importe o repositório `ghost-camp`.
4. Expanda a aba **Environment Variables** e copie TODAS as chaves que existem no arquivo `.env.local` desta pasta para dentro da Vercel (Isso garante que o app consiga chamar o DB no servidor de produção).
5. Clique em **Deploy**. Quando o deploy acabar, a Vercel vai gerar um subdomínio (ex: `ghost-camp.vercel.app`). 

## Etapa 2: Configurar o Domínio Personalizado

6. No painel da Vercel (na tela do seu projeto novo), vá na aba **Settings** > **Domains**.
7. Adicione o seu domínio adquirido: `ghostcampsp.com.br`.
8. A Vercel irá informar que o domínio *"não está configurado"*. E dará duas opções: **Nameservers** (NS) ou **A Record / CNAME**.
   
### Como gerenciar pelo Netlify (Opção Recomendada no seu caso):

Já que os servidores do Registro.br estão direcionando para o *Netlify*, você precisa acessar o seu painel do Netlify e encontrar a configuração de DNS deste domínio e criar 2 registros baseados na Vercel:

* **Record 1 (A Record - Raiz)** 
   - Nome: `@` (Raiz)
   - Tipo: `A`
   - Valor: `76.76.21.21` (Este é o IP Padrão global da Vercel, confirme no painel deles).
   
* **Record 2 (CNAME - Para o 'www')**
   - Nome: `www`
   - Tipo: `CNAME`
   - Valor: `cname.vercel-dns.com.`

Após adicionar os registros na tabela DNS do Netlify, a Vercel (que faz rechecagem constante) emitirá automaticamente o **SSL (Cadeado Verde)** e colocará o site no ar.

> **💡 Dica Secundária:** Se no futuro não quiser mais usar dependências de DNS do Netlify, basta entrar no **Registro.br** e inserir diretamente os NAMESERVERS que a Vercel recomenda. (ex: `ns1.vercel-dns.com` e `ns2.vercel-dns.com`).
